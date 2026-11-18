#!/usr/bin/env python3
"""Đọc các báo cáo có trang riêng và ghi vào data/*.json.

  - Báo cáo nhanh sản xuất & tiêu thụ TUẦN  -> data/weekly.json   (trang tuan.html)
  - Báo cáo tiêu thụ & XNT (theo tuần/tháng) -> data/ctt.json      (trang ctt.html)
  - Bảng phân tích lệch giá CTBH            -> data/ctbh.json     (trang ctbh.html)

Dùng: python scripts/ingest_reports.py inbox data
File nhận dạng được: loại 1 và 3 được chuyển sang inbox/processed (hoặc inbox/failed nếu lỗi);
loại 2 chỉ được đọc (không di chuyển) để scripts/ingest.py vẫn cập nhật dữ liệu chính.
File không thuộc 3 loại trên được giữ nguyên cho scripts/ingest.py.
"""
import sys, os, re, json, glob, shutil, datetime, traceback


def read_any(path):
    """Trả về {tên sheet: [các dòng]} cho cả .xlsx và .xls (nhận dạng theo nội dung, không theo đuôi file)."""
    with open(path, 'rb') as fh:
        head = fh.read(8)
    out = {}
    if head[:2] == b'PK':
        import openpyxl
        wb = openpyxl.load_workbook(path, data_only=True)
        for ws in wb.worksheets:
            out[ws.title] = [list(r) for r in ws.iter_rows(values_only=True)]
    elif head[:4] == b'\xd0\xcf\x11\xe0':
        try:
            import xlrd
        except ImportError:
            raise RuntimeError('thiếu thư viện xlrd để đọc file .xls (pip install xlrd)')
        wb = xlrd.open_workbook(path)
        for sh in wb.sheets():
            out[sh.name] = [[(None if c == '' else c) for c in sh.row_values(i)] for i in range(sh.nrows)]
    else:
        raise RuntimeError('không phải file Excel (.xls/.xlsx)')
    return out


def txt(v):
    return '' if v is None else str(v).strip()


def num(v):
    return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def cell(r, j):
    return r[j] if j < len(r) else None


def iso(d, m, y):
    return '%04d-%02d-%02d' % (int(y), int(m), int(d))


# ---------- 1) Báo cáo nhanh tuần ----------
PROD = [('cl', r'^tissue cuộn lớn'), ('clxk', r'^tr\.?\s*đó.*clxk'), ('tp', r'^tissue thành phẩm'),
        ('tong', r'^tổng\s*\(i\+ii\)'), ('ku', r'^khăn ướt'), ('pm', r'^kư papamama'), ('go', r'^gỗ dán')]


def is_weekly(S):
    for rows in S.values():
        for r in rows[:12]:
            if any(re.search(r'BÁO CÁO NHANH SẢN XUẤT VÀ TIÊU THỤ', txt(c), re.I) for c in r):
                return rows
    return None


def parse_weekly(rows, name):
    title = next(txt(c) for r in rows[:12] for c in r if re.search(r'BÁO CÁO NHANH SẢN XUẤT VÀ TIÊU THỤ', txt(c), re.I))
    m = re.search(r'TUẦN\s*(\d+)\s*NĂM\s*(\d{4})', title, re.I)
    if not m:
        raise ValueError('không đọc được số tuần/năm ở tiêu đề')
    w, y = int(m.group(1)), int(m.group(2))
    blob = ' '.join(txt(c) for r in rows[:12] for c in r)
    d = re.search(r'Từ ngày\s*(\d+)/(\d+)/(\d{4})\s*đến ngày\s*(\d+)/(\d+)/(\d{4})', blob)
    frm = to = None
    month = None
    if d:
        frm, to = iso(d.group(1), d.group(2), d.group(3)), iso(d.group(4), d.group(5), d.group(6))
        month = int(d.group(5))
    mm = re.search(r'Tháng\s*(\d+)\s*/+\s*(\d{4})', blob)
    if mm:
        month = int(mm.group(1))
    dt = kh = pct = None
    for r in rows[:12]:
        for j, c in enumerate(r):
            t = txt(c)
            if re.match(r'^Tổng DT', t, re.I):
                dt = next((num(x) for x in r[j + 1:j + 4] if num(x) is not None), None)
            if re.match(r'^\(?KH', t, re.I):
                kh = next((num(x) for x in r[j + 1:j + 3] if num(x) is not None), None)
    if dt is not None and kh:
        pct = dt / kh * 100
    prods = {}
    for r in rows[9:40]:
        nm = txt(cell(r, 1)).lower()
        for code, rx in PROD:
            if re.search(rx, nm) and code not in prods:
                prods[code] = {'dvt': txt(cell(r, 2)), 'ky': num(cell(r, 7)), 'thang': num(cell(r, 8)), 'luyke': num(cell(r, 9)),
                               'kh': num(cell(r, 10)), 'pct': num(cell(r, 11))}
    if not prods:
        raise ValueError('không thấy dòng sản phẩm')
    return {'y': y, 'w': w, 'from': frm, 'to': to, 'month': month, 'dt': dt, 'dt_kh': kh, 'dt_pct': pct, 'prods': prods, 'file': name}


# ---------- 2) Báo cáo tiêu thụ & XNT ----------
RGN = {'ĐBSH': 'ĐBSH', 'ĐB SÔNG HỒNG': 'ĐBSH', 'ĐỒNG BẰNG SÔNG HỒNG': 'ĐBSH', 'HÀ NỘI': 'Hà Nội', 'MIỀN TRUNG': 'Miền Trung',
       'MIỀN NÚI': 'Miền Núi', 'MIỀN NAM': 'Miền Nam', 'SIÊU THỊ': 'Siêu thị'}


def is_ctt(S):
    k1 = next((k for k in S if re.search(r'Thành Phẩm Toàn Quốc', k, re.I)), None)
    k2 = next((k for k in S if re.search(r'XUẤT NHẬP TỒN', k, re.I)), None)
    return (k1, k2) if k1 and k2 else None


def parse_ctt(S, ks, name):
    a, x = S[ks[0]], S[ks[1]]
    blob = ' '.join(txt(c) for r in a[:5] for c in r)
    m = re.search(r'THÁNG\s*(\d+)\s*NĂM\s*(\d{4})', blob, re.I)
    if not m:
        raise ValueError('không đọc được tháng/năm ở tiêu đề')
    mo, y = int(m.group(1)), int(m.group(2))
    xb = ' '.join(txt(c) for r in x[:6] for c in r)
    dn = re.search(r'đến ngày\s*(\d+)', xb, re.I)
    regions, prods, total = [], [], None
    for r in a[4:40]:
        s0 = txt(cell(r, 0))
        if re.match(r'^Tổng cộng', s0, re.I):
            total = {'chi_tieu': num(cell(r, 3)), 'pct_dk': num(cell(r, 4)), 'dk': num(cell(r, 6)),
                     'tuan': [num(cell(r, j)) for j in range(7, 12)], 'tong': num(cell(r, 12)), 'pct': num(cell(r, 13))}
            continue
        if num(cell(r, 0)) is not None and txt(cell(r, 2)) and num(cell(r, 3)) is not None:
            row = {'stt': int(num(cell(r, 0))), 'truong_vung': txt(cell(r, 1)), 'ten': txt(cell(r, 2)), 'chi_tieu': num(cell(r, 3)),
                   'pct_dk': num(cell(r, 4)), 'pct_doi': num(cell(r, 5)), 'dk': num(cell(r, 6)),
                   'tuan': [num(cell(r, j)) for j in range(7, 12)], 'tong': num(cell(r, 12)), 'pct': num(cell(r, 13))}
            (prods if total is not None else regions).append(row)
    npp, reg = [], ''
    for r in x[2:]:
        a0 = txt(cell(r, 0))
        if re.match(r'^KHU VỰC', a0, re.I):
            k = re.sub(r'^KHU VỰC\s*', '', a0, flags=re.I).upper().strip()
            reg = RGN.get(k, a0.title())
            continue
        if num(cell(r, 0)) is not None and txt(cell(r, 1)) and reg:
            g = lambda j: num(cell(r, j)) or 0
            npp.append({'kv': reg, 'stt': int(num(cell(r, 0))), 'ten': txt(cell(r, 1)), 'tinh': txt(cell(r, 2)), 'chi_tieu': g(3), 'ton_dau': g(4),
                        'nhap': g(5), 'xuat': g(6), 'ton_cuoi': g(7), 'dk_nhap': g(8), 'dk_ds': g(9)})
    if not regions and not npp:
        raise ValueError('không đọc được số liệu khu vực hoặc NPP')
    return {'y': y, 'm': mo, 'den_ngay': int(dn.group(1)) if dn else None, 'regions': regions, 'products': prods, 'total': total, 'npp': npp, 'file': name}


# ---------- 3) Lệch giá CTBH ----------
def is_ctbh(S):
    for rows in S.values():
        for r in rows[:6]:
            if any(re.search(r'PHÂN TÍCH LỆCH GIÁ', txt(c), re.I) for c in r):
                return rows
    return None


def parse_ctbh(rows, name):
    lab = [txt(c) for r in rows[:4] for c in r if txt(c) and re.search(r'CHƯƠNG TRÌNH|CTBH', txt(c), re.I)]
    old = next((t for t in lab if re.search(r'GIÁ THEO CHƯƠNG TRÌNH', t, re.I)), '')
    new = next((t for t in lab if re.match(r'^CTBH', t, re.I)), '')
    k = re.search(r'T(\d+)\s*/\s*(\d{4})', new)
    items = []
    for r in rows[3:]:
        if num(cell(r, 0)) is not None and txt(cell(r, 1)):
            g = lambda j: num(cell(r, j))
            items.append({'stt': int(num(cell(r, 0))), 'sp': txt(cell(r, 1)), 'gia_truoc_vat': g(2), 'ck_gia': g(3), 'gia_sau_ck': g(4), 'gia_sau_vat': g(5),
                          'ck_quy_che': g(6), 'sau_quy_che': g(7), 'ck_ban_hang': g(8), 'cuoi_cu': g(9), 'sau_vat_moi': g(10), 'ckht': g(11),
                          'cuoi_moi': g(12), 'lech': g(13)})
    if not items:
        raise ValueError('không thấy dòng sản phẩm')
    return {'id': (k and 'T%02d-%s' % (int(k.group(1)), k.group(2))) or os.path.splitext(name)[0], 'cu': old, 'moi': new, 'items': items, 'file': name}


# ---------- 4) Báo cáo bán hàng thành phẩm theo đối tượng (BC BHTP theo ĐT Tháng NN.2026) ----------
GRP = {'GVS': 'Giấy vệ sinh', 'GVS15': 'Giấy vệ sinh', 'KLM': 'Khăn lau mặt', 'KA': 'Khăn ăn', 'KĐN': 'Khăn đa năng',
       'KU': 'Khăn ướt', 'CKTP': 'Chiết khấu', 'ĐC': 'Điều chỉnh', 'KM': 'Khuyến mại'}


def is_sales(S):
    for rows in S.values():
        for i, r in enumerate(rows[:25]):
            if txt(cell(r, 0)) == 'Mã số':
                return rows, i
    return None


def period_from_name(name):
    m = re.search(r'[Tt]háng\s*0?(\d{1,2})\s*[.\-/ ]\s*(?:năm\s*)?(\d{4})', name)
    if m:
        return int(m.group(2)), int(m.group(1))
    m = re.search(r'T0?(\d{1,2})(?!\d)', name)
    y = re.search(r'(20\d\d)', name)
    if m and y:
        return int(y.group(1)), int(m.group(1))
    return None


def parse_sales(rows, h, name):
    per = period_from_name(name)
    if not per:
        raise ValueError('không xác định được tháng/năm từ tên file (cần dạng "Tháng 10.2026" hoặc "T10 2026")')
    y, m = per
    H = {txt(c): j for j, c in enumerate(rows[h]) if txt(c)}
    need = ['Số lượng', 'Doanh số (chưa CK)', 'Doanh số (chưa thuế)']
    if any(k not in H for k in need):
        raise ValueError('thiếu cột: ' + ', '.join(k for k in need if k not in H))
    g = lambda r, k: num(cell(r, H[k])) or 0
    out, cust = [], ''
    for r in rows[h + 1:]:
        if txt(cell(r, 1)).startswith('Đối tượng'):
            cust = txt(cell(r, 1)).replace('Đối tượng:', '').strip()
            continue
        code = txt(cell(r, 0))
        if not code or not cust or re.match(r'^(Tổng cộng|Người lập)', code):
            continue
        out.append([y, m, cust[:60], code, GRP.get(code.split('_')[0], 'Khác'), round(g(r, 'Số lượng'), 1),
                    round(g(r, 'Doanh số (chưa thuế)')), round(g(r, 'Doanh số (chưa CK)'))])
    if not out:
        raise ValueError('không có dòng bán hàng')
    return y, m, out


# ---------- 5) Báo cáo tuần định dạng "BC TUAN NN" (cùng bố cục BC SX TT, số liệu theo tuần, đơn vị tấn) ----------
def is_weekly2(S):
    for rows in S.values():
        t = ' '.join(txt(c) for r in rows[:3] for c in r)
        if re.search(r'BÁO CÁO SẢN XUẤT VÀ TIÊU THỤ', t, re.I) and re.search(r'BC\s*TU[AẦ]N\s*\d+', t, re.I) and not re.search(r'THÁNG\s*\d+\s*/', t, re.I):
            return rows
    return None


def guess_year(name, week):
    m = re.search(r'(20\d\d)', name)
    if m:
        return int(m.group(1))
    t = datetime.date.today()
    return t.year - 1 if (t.month == 1 and week >= 50) else t.year


def parse_weekly2(rows, name, W):
    t = ' '.join(txt(c) for r in rows[:3] for c in r)
    w = int(re.search(r'BC\s*TU[AẦ]N\s*(\d+)', t, re.I).group(1))
    y = guess_year(name, w)
    d0 = datetime.date.fromisocalendar(y, w, 1)
    d1 = d0 + datetime.timedelta(days=6)
    month = d1.month
    dt = kh = None
    for r in rows[:3]:
        for j, c in enumerate(r):
            s_ = txt(c)
            if re.match(r'^Doanh thu tuần', s_, re.I):
                dt = next((num(x) for x in r[j + 1:j + 3] if num(x) is not None), None)
            if re.match(r'^Doanh thu tháng', s_, re.I):
                kh = next((num(x) for x in r[j + 1:j + 3] if num(x) is not None), None)
    hr = next((i for i, r in enumerate(rows[:10]) if any(txt(c).upper() == 'TIÊU THỤ' for c in r)), None)
    if hr is None:
        raise ValueError('không thấy tiêu đề cột TIÊU THỤ')
    hdr = rows[hr]
    sx0 = next(j for j, c in enumerate(hdr) if txt(c).upper() == 'SẢN XUẤT')
    tt0 = next(j for j, c in enumerate(hdr) if txt(c).upper() == 'TIÊU THỤ')
    prev = next((x for x in W['weeks'] if x['y'] == y and x['w'] == w - 1 and x.get('month') == month), None)
    old = next((x for x in W['weeks'] if x['y'] == y and x['w'] == w), None)
    codes = [('cl', r'^giấy tissue cuộn lớn'), ('tp', r'^giấy tissue thành phẩm'), ('ku', r'^khăn ướt'), ('pm', r'^kư papamama'), ('go', r'^gỗ dán')]
    prods = {}
    for r in rows[hr + 2:]:
        nm = txt(cell(r, 1)).lower()
        for code, rx in codes:
            if re.search(rx, nm) and code not in prods:
                mult = 1000.0 if code in ('cl', 'tp') else 1.0
                g = lambda j: (num(cell(r, j)) * mult if num(cell(r, j)) is not None else None)
                ky = g(tt0)
                if ky is None and g(tt0 + 2) is not None:
                    ky = 0.0   # ô tuần để trống nhưng có lũy kế: coi là 0
                pv = prev['prods'].get(code, {}).get('thang') if prev else None
                thang = (ky or 0) + (pv or 0) if ky is not None else None
                khm = g(tt0 + 1)
                prods[code] = {'dvt': txt(cell(r, 2)), 'ky': ky, 'thang': thang, 'luyke': g(tt0 + 2), 'kh': khm,
                               'pct': (thang / khm * 100) if (thang is not None and khm) else None,
                               'sx_ky': g(sx0), 'sx_luyke': g(sx0 + 2), 'sx_kh': g(sx0 + 1), 'sx_luyke_kh': g(sx0 + 3), 'luyke_kh': g(tt0 + 3)}
    if not prods:
        raise ValueError('không thấy dòng sản phẩm')
    if 'cl' in prods and 'tp' in prods:
        a, b = prods['cl'], prods['tp']
        add = lambda k: (a[k] or 0) + (b[k] or 0) if (a[k] is not None or b[k] is not None) else None
        prods['tong'] = {'dvt': 'Tấn', 'ky': add('ky'), 'thang': add('thang'), 'luyke': add('luyke'), 'kh': add('kh'), 'pct': None, 'sx_ky': add('sx_ky'), 'sx_luyke': add('sx_luyke')}
    if old:   # giữ các dòng chi tiết có ở báo cáo tuần cũ (ví dụ CLXK)
        for k, v in old['prods'].items():
            prods.setdefault(k, v)
    return {'y': y, 'w': w, 'from': d0.isoformat(), 'to': d1.isoformat(), 'month': month, 'dt': dt, 'dt_kh': kh,
            'dt_pct': (dt / kh * 100) if dt is not None and kh else None, 'dt_tuan': True, 'prods': prods, 'file': name}


# ---------- 6) Xuất nhập tồn nhà phân phối nhiều tháng (Báo cáo XNT các KV) ----------
def is_xnt_multi(S):
    return [k for k in S if re.match(r'^\s*T0?\d{1,2}-\d{4}', k)] or None


def parse_xnt_multi(S):
    best = {}
    for n in S:
        m = re.match(r'^\s*T0?(\d{1,2})-(\d{4})', n)
        if not m:
            continue
        sc = -1 if n.strip() == 'T6-2026(chuẩn) (2)' else 0 if 'chuẩn' in n else 1 if re.fullmatch(r'\s*T0?\d+-\d{4}\s*', n) else 2
        k = (int(m.group(2)), int(m.group(1)))
        if k not in best or sc < best[k][0]:
            best[k] = (sc, n)
    out = []
    for (y, mo), (_, n) in sorted(best.items()):
        reg = ''
        for r in S[n][3:]:
            a, b = txt(cell(r, 0)), txt(cell(r, 1))
            if re.match(r'^KV\s', a, re.I):
                k = re.sub(r'^KV\s+', '', a, flags=re.I).upper().strip()
                reg = RGN.get(k, a[3:].title())
                continue
            if not b or not reg or re.match(r'^(TỔNG|CỘNG)', a, re.I) or re.match(r'^(TỔNG|CỘNG)|^\(|\)\s*\+|\+\s*\(', b, re.I):
                continue
            pv = isinstance(cell(r, 2), str) and cell(r, 2).strip()
            vals = [num(c) for c in (r[3:8] if pv else r[2:]) if num(c) is not None]
            if len(vals) >= 4:
                out.append([y, mo, reg, b, round(vals[0]), round(vals[1]), round(vals[2]), round(vals[3])])
    if not out:
        raise ValueError('không đọc được dòng NPP nào')
    return out


def load(p, default):
    try:
        return json.load(open(p, encoding='utf-8'))
    except Exception:
        return default


def save(p, d):
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))


def main():
    inbox = sys.argv[1] if len(sys.argv) > 1 else 'inbox'
    data = sys.argv[2] if len(sys.argv) > 2 else 'data'
    W = load(os.path.join(data, 'weekly.json'), {'weeks': []})
    C = load(os.path.join(data, 'ctt.json'), {'snapshots': []})
    P = load(os.path.join(data, 'ctbh.json'), {'versions': []})
    N = load(os.path.join(data, 'npp.json'), {'rows': []})
    dj = os.path.join(data, 'data.json')
    D = load(dj, None)
    logs = []
    dirty = False
    n = 0
    for f in sorted(glob.glob(os.path.join(inbox, '*.xls*'))):
        if f.endswith('.meta.json'):
            continue
        name = os.path.basename(f)
        meta = {}
        mp = f + '.meta.json'
        if os.path.exists(mp):
            try:
                meta = json.load(open(mp, encoding='utf-8'))
            except Exception:
                meta = {}
        now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        src = meta.get('source') or 'GitHub'
        by = meta.get('from') or os.environ.get('GITHUB_ACTOR', '') or '?'
        try:
            S = read_any(f)
        except Exception as e:
            continue   # để scripts/ingest.py xử lý và báo lỗi
        try:
            move = True
            rows = is_weekly(S)
            if rows is not None:
                w = parse_weekly(rows, name)
                W['weeks'] = [x for x in W['weeks'] if not (x['y'] == w['y'] and x['w'] == w['w'])] + [w]
                kind, summ = 'Báo cáo tuần', 'Tuần %d/%d (%s đến %s)' % (w['w'], w['y'], w['from'], w['to'])
            elif is_weekly2(S) is not None:
                w = parse_weekly2(is_weekly2(S), name, W)
                W['weeks'] = [x for x in W['weeks'] if not (x['y'] == w['y'] and x['w'] == w['w'])] + [w]
                kind, summ = 'Báo cáo tuần', 'Tuần %d/%d (%s đến %s)' % (w['w'], w['y'], w['from'], w['to'])
            elif is_xnt_multi(S):
                rows_ = parse_xnt_multi(S)
                ks = {(r[0], r[1]) for r in rows_}
                N['rows'] = [r for r in N['rows'] if (r[0], r[1]) not in ks] + rows_
                kind, summ = 'XNT nhà phân phối', '%d dòng, %d tháng (T%d/%d đến T%d/%d)' % (len(rows_), len(ks), min(ks)[1], min(ks)[0], max(ks)[1], max(ks)[0])
            elif is_ctbh(S) is not None:
                v = parse_ctbh(is_ctbh(S), name)
                P['versions'] = [x for x in P['versions'] if x['id'] != v['id']] + [v]
                kind, summ = 'Lệch giá CTBH', '%d sản phẩm, kỳ %s' % (len(v['items']), v['id'])
            elif is_sales(S) is not None and D is not None:
                rws, hi = is_sales(S)
                y, m, rows_ = parse_sales(rws, hi, name)
                D['sales'] = [r for r in D.get('sales', []) if not (r[0] == y and r[1] == m)] + rows_
                kind, summ = 'Bán hàng thành phẩm', '%d dòng, tháng %d/%d' % (len(rows_), m, y)
                dirty = True
            elif is_ctt(S):
                c = parse_ctt(S, is_ctt(S), name)
                C['snapshots'] = [x for x in C['snapshots'] if not (x['y'] == c['y'] and x['m'] == c['m'])] + [c]
                print('OK  ', name, '-> ctt.json tháng %d/%d (đến ngày %s, %d NPP)' % (c['m'], c['y'], c['den_ngay'], len(c['npp'])))
                n += 1
                continue   # không di chuyển, không ghi lịch sử: scripts/ingest.py xử lý tiếp
            else:
                continue
            print('OK  ', name, '->', kind, summ)
            logs.append([now, name, src, by, kind, summ])
            os.makedirs(os.path.join(inbox, 'processed'), exist_ok=True)
            shutil.move(f, os.path.join(inbox, 'processed', name))
            if os.path.exists(mp):
                shutil.move(mp, os.path.join(inbox, 'processed', name + '.meta.json'))
            n += 1
        except Exception as e:
            print('LỖI ', name, e)
            traceback.print_exc()
            logs.append([now, name, src, by, 'Lỗi', 'Không đọc được: ' + str(e)])
            os.makedirs(os.path.join(inbox, 'failed'), exist_ok=True)
            shutil.move(f, os.path.join(inbox, 'failed', name))
            if os.path.exists(mp):
                shutil.move(mp, os.path.join(inbox, 'failed', name + '.meta.json'))
            n += 1
    if n:
        W['weeks'].sort(key=lambda x: (x['y'], x['w']))
        C['snapshots'].sort(key=lambda x: (x['y'], x['m']))
        P['versions'].sort(key=lambda x: x['id'])
        os.makedirs(data, exist_ok=True)
        save(os.path.join(data, 'weekly.json'), W)
        save(os.path.join(data, 'ctt.json'), C)
        save(os.path.join(data, 'ctbh.json'), P)
        N['rows'].sort(key=lambda r: (r[0], r[1], r[2], r[3]))
        if N['rows']:
            save(os.path.join(data, 'npp.json'), N)
    if (logs or dirty) and D is not None:
        D.setdefault('log', []).extend(logs)
        D['log'] = D['log'][-500:]
        save(dj, D)
    print('ingest_reports: đã xử lý', n, 'file')


if __name__ == '__main__':
    main()
