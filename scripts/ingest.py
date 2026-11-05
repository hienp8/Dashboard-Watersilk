#!/usr/bin/env python3
"""Đọc các file báo cáo trong thư mục inbox/ và cập nhật data/data.json.
Dùng: python scripts/ingest.py [thư_mục_inbox] [data.json]   (file .xls cần: pip install xlrd)"""
import json,re,sys,os,glob,shutil
import openpyxl
GR={'GVS':'Giấy vệ sinh','GVS15':'Giấy vệ sinh','KLM':'Khăn lau mặt','KA':'Khăn ăn','KĐN':'Khăn đa năng','KU':'Khăn ướt','CKTP':'Chiết khấu','ĐC':'Điều chỉnh','KM':'Khuyến mại'}
RG={'MIỀN NÚI':'Miền Núi','HÀ NỘI':'Hà Nội','ĐBSH':'ĐBSH','MIỀN TRUNG':'Miền Trung','MIỀN NAM':'Miền Nam'}
KEY={'sales':lambda r:(r[0],r[1]),'xnt':lambda r:(r[0],r[1]),'tt':lambda r:(r[0],r[1]),'dt':lambda r:(r[0],r[1]),'comp':lambda r:(r[0],r[1],r[2]),'plan':lambda r:(r[0],r[1],r[2]),'sx':lambda r:(r[0],r[1],r[2])}
def txt(v): return '' if v is None else str(v).strip()
def isn(v): return isinstance(v,(int,float)) and not isinstance(v,bool)
def num(v):
    if isn(v): return float(v)
    n=[float(x) for x in re.findall(r'\d+(?:\.\d+)?',str(v or '').replace(',','.'))]
    return (n[0]+(n[1] if len(n)>1 else n[0]))/2 if n else None
def read(path):
    if path.lower().endswith('.xls'):
        import xlrd
        wb=xlrd.open_workbook(path); S={s.name:[[(c if c!='' else None) for c in s.row_values(i)] for i in range(s.nrows)] for s in wb.sheets()}
    else:
        wb=openpyxl.load_workbook(path,data_only=True); S={ws.title:[list(r) for r in ws.iter_rows(values_only=True)] for ws in wb.worksheets}
    return {k:[r+[None]*(max(0,30-len(r))) for r in v] for k,v in S.items()}
def period(name,y0=0,m0=0):
    m=re.search(r'T0?(\d{1,2})(?!\d)',name,re.I); y=re.search(r'(20\d\d)',name)
    return (int(y[1]) if y else y0, int(m[1]) if m else m0)
def p_sx(S,name):
    a=list(S.values())[0]; hd=a[:12]
    ti=next((txt(c) for r in hd for c in r if 'TIÊU THỤ THÁNG' in txt(c).upper()),''); mm=re.search(r'THÁNG\s*(\d+)\s*/\s*(\d{4})',ti,re.I)
    if not mm: raise ValueError('không đọc được tháng/năm')
    y,m=int(mm[2]),int(mm[1]); hi=next(i for i,r in enumerate(a) if any(re.fullmatch(r'\s*SẢN PHẨM\s*',txt(c),re.I) for c in r))
    sx=[];CODES=[('cl',r'cuộn lớn'),('tp',r'thành phẩm'),('go',r'^gỗ dán'),('ku',r'khăn ướt ws'),('pm',r'papamama')]
    for r in a[hi+2:]:
        n=txt(r[1])
        if n.lower().startswith('ghi chú'): break
        if not n or 'trả lại' in n or n.lower().startswith('tổng'): continue
        cd=next((c for c,rx in CODES if re.search(rx,n,re.I)),None)
        if cd and any(isn(x) for x in r[3:13]) and not any(x[2]==cd for x in sx): sx.append([y,m,cd]+[round(x,2) if isn(x) else None for x in r[3:13]])
    th=kh=None
    for r in hd[:9]:
        for j,c in enumerate(r):
            if isinstance(c,str) and re.search(r'doanh thu',c,re.I):
                nx=next((x for x in r[j+1:] if isn(x)),None)
                if re.search(r'kế hoạch',c,re.I): kh=nx
                elif re.search(r'thực hiện',c,re.I): th=nx
    tt=[y,m,None,None,None]
    for r in sx:
        if r[2]=='cl': tt[2]=r[11]
        elif r[2]=='tp': tt[3]=r[11]
        elif r[2]=='go': tt[4]=r[11]
    dt=[[y,m,round(th/1e3)/1e3,round(kh/1e3)/1e3 if kh is not None else None]] if th is not None else []
    return {'sx':sx,'dt':dt,'tt':[tt]}
def p_bh(S,name,y0,m0):
    a=list(S.values())[0]; h=next(i for i,r in enumerate(a) if r[0]=='Mã số'); H={txt(c):j for j,c in enumerate(a[h]) if c}
    y,m=period(name,y0,m0)
    if not y or not m: raise ValueError('không xác định được kỳ')
    out=[];c=''
    g=lambda r,k:r[H[k]] if k in H and isn(r[H[k]]) else 0
    for r in a[h+1:]:
        if r[1] and txt(r[1]).startswith('Đối tượng'): c=txt(r[1]).replace('Đối tượng:','').strip(); continue
        code=txt(r[0])
        if not code or not c or re.match(r'(Tổng cộng|Người lập)',code): continue
        out.append([y,m,c[:60],code,GR.get(code.split('_')[0],'Khác'),round(g(r,'Số lượng'),1),round(g(r,'Doanh số (chưa thuế)')),round(g(r,'Doanh số (chưa CK)'))])
    return {'sales':out}
def p_xnt_multi(S):
    best={}
    for n in S:
        mm=re.match(r'\s*T0?(\d{1,2})-(\d{4})',n)
        if not mm: continue
        sc=0 if 'chuẩn' in n else 1 if re.fullmatch(r'\s*T0?\d+-\d{4}\s*',n) else 2; k=(int(mm[2]),int(mm[1]))
        if k not in best or sc<best[k][0]: best[k]=(sc,n)
    out=[]
    for (y,m),(_,n) in best.items():
        reg=''
        for r in S[n][3:]:
            a,b=txt(r[0]),txt(r[1])
            if re.match(r'KV\s',a,re.I): reg=RG.get(re.sub(r'^KV\s+','',a,flags=re.I).upper().strip(),a); continue
            if not b or not reg or re.match(r'(TỔNG|Tổng|CỘNG|Cộng)',a) or re.search(r'^\(|\)\s*\+|\+\s*\(|^(TỔNG|Tổng|CỘNG|Cộng)',b): continue
            pv=isinstance(r[2],str) and r[2].strip(); v=[x for x in (r[3:8] if pv else r[2:]) if isn(x)]
            if len(v)>=4: out.append([y,m,reg,b,round(v[0]),round(v[1]),round(v[2]),round(v[3])])
    return {'xnt':out}
def p_tt(S,old):
    o={}
    for s,i in (('CUỘN LỚN',2),('thành phẩm',3),('Gỗ',4)):
        a=S[s]
        for r in range(2,14):
            for c in range(1,11):
                v=a[r][c] if r<len(a) else None
                if isn(v) and v>0:
                    y,m=2016+c,r-1; e=next((t for t in old if t[0]==y and t[1]==m),[y,m,None,None,None]); o.setdefault((y,m),list(e))[i]=v
    return {'tt':list(o.values())}
def p_comp(S,name,y0,m0):
    a=list(S.values())[0]; area=re.sub(r'.*Khu vực:\s*','',txt(next((c for c in a[2] if c),''))).strip()
    dt=txt(next((c for c in a[1] if c),'')); mm=re.search(r'háng\s*(\d+)\D+(\d{4})',dt,re.I); y,m=(int(mm[2]),int(mm[1])) if mm else period(name,y0,m0)
    if not y or not m: raise ValueError('không xác định được kỳ')
    out=[]
    for r in a[5:40]:
        if not isinstance(r[1],str): continue
        for k,n in enumerate(['Tiến Hiếu','Thuận Phát','Xương Giang','Sông Đuống']):
            s=2+4*k; p,q=r[s+1],r[s+2]
            if p is None and q is None: continue
            out.append([y,m,area,r[1].strip().replace('\n',' '),n,p,q,num(p),num(q),txt(r[s])])
    return {'comp':out}
def p_w(S,name,y0,m0):
    tn=next(n for n in S if re.search('Thành Phẩm Toàn Quốc',n,re.I)); xn=next(n for n in S if re.search('XUẤT NHẬP TỒN',n,re.I)); t=S[tn]
    ti=txt(next((c for r in t[:4] for c in r if re.search(r'THÁNG\s*\d+',txt(c),re.I)),'')); mm=re.search(r'THÁNG\s*(\d+)\s*(?:NĂM\s*)?(\d{4})?',ti,re.I)
    py,pm=period(name,y0,m0); m=int(mm[1]) if mm else pm; y=int(mm[2]) if mm and mm[2] else py
    if not y or not m: raise ValueError('không xác định được kỳ')
    sc=lambda v:(v/1e9 if v>1e6 else v/1e3) if isn(v) else 0
    plan=[[y,m,txt(r[2]),round(sc(r[3]),4),round(sc(r[12]),4),'BC tiêu thụ & XNT (đến tuần báo cáo)'] for r in t[5:] if isn(r[0]) and r[2] and isn(r[3]) and re.search(r'Hà Nội|ĐBSH|Miền|Siêu thị',txt(r[2]),re.I)]
    xnt=[];reg=''
    for r in S[xn]:
        a=txt(r[0])
        if re.match(r'KHU VỰC',a,re.I):
            u=a.upper(); reg='ĐBSH' if ('SÔNG HỒNG' in u or 'ĐBSH' in u) else 'Hà Nội' if 'HÀ NỘI' in u else 'Miền Trung' if 'TRUNG' in u else 'Miền Núi' if 'NÚI' in u else 'Miền Nam' if 'NAM' in u else a; continue
        if isn(r[0]) and txt(r[1]) and reg: xnt.append([y,m,reg,re.sub(r'[^\w\s\(\)/\-\.]+$','',txt(r[1])).strip(),*[round(r[i]) if isn(r[i]) else 0 for i in (4,5,6,7)]])
    return {'plan':plan,'xnt':xnt}
def detect(S,name,y0=0,m0=0,D=None):
    sn=list(S); a0=S[sn[0]][:12]
    if any(re.search('SẢN XUẤT VÀ TIÊU THỤ',txt(c),re.I) for r in a0 for c in r): return p_sx(S,name)
    if any(re.search('Thành Phẩm Toàn Quốc',n,re.I) for n in sn) and any(re.search('XUẤT NHẬP TỒN',n,re.I) for n in sn): return p_w(S,name,y0,m0)
    if 'CUỘN LỚN' in sn and 'thành phẩm' in sn: return p_tt(S,D['tt'] if D else [])
    if any(re.match(r'\s*T0?\d+-\d{4}',n) for n in sn): return p_xnt_multi(S)
    a=S[sn[0]][:15]
    if any(r[0]=='Mã số' for r in a): return p_bh(S,name,y0,m0)
    if any(re.search('SO SÁNH ĐỐI THỦ',txt(c),re.I) for r in a[:4] for c in r): return p_comp(S,name,y0,m0)
    raise ValueError('chưa nhận dạng được loại file')
def put(D,k,rows):
    ks={KEY[k](r) for r in rows}; D[k]=[r for r in D.get(k,[]) if KEY[k](r) not in ks]+rows
def main():
    inbox=sys.argv[1] if len(sys.argv)>1 else 'inbox'; dj=sys.argv[2] if len(sys.argv)>2 else 'data/data.json'
    D=json.load(open(dj,encoding='utf-8')); n=0
    for f in sorted(glob.glob(os.path.join(inbox,'*.xls*'))):
        try:
            res=detect(read(f),os.path.basename(f),0,0,D)
            for k,rows in res.items(): put(D,k,rows)
            print('OK ',os.path.basename(f),{k:len(v) for k,v in res.items()}); n+=1
            os.makedirs(os.path.join(inbox,'processed'),exist_ok=True); shutil.move(f,os.path.join(inbox,'processed',os.path.basename(f)))
        except Exception as e: print('LỖI',os.path.basename(f),e)
    if n: json.dump(D,open(dj,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    print('Đã cập nhật',n,'file')
if __name__=='__main__': main()
