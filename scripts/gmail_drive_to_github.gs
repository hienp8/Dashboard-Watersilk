/**
 * Google Apps Script: tự động đưa file báo cáo (.xls/.xlsx) từ Gmail hoặc thư mục Google Drive
 * vào thư mục inbox/ của repo GitHub. GitHub Actions sẽ đọc file, cập nhật data/data.json và ghi lịch sử.
 *
 * Phân quyền: chỉ email gửi từ địa chỉ trong ALLOWED_SENDERS mới được nạp. Với Drive, chỉ người được
 * chia sẻ quyền chỉnh sửa thư mục mới bỏ file vào được.
 *
 * Cài đặt (một lần):
 * 1. Vào script.google.com, tạo dự án mới, dán toàn bộ mã này.
 * 2. Tạo GitHub token (Settings > Developer settings > Fine-grained tokens): chỉ chọn repo Dashboard-Watersilk,
 *    quyền Contents = Read and write. Trong Apps Script: Project Settings > Script properties > thêm GITHUB_TOKEN.
 * 3. Sửa CFG: OWNER, REPO, ALLOWED_SENDERS (bắt buộc), DRIVE_FOLDER_ID (nếu dùng Drive).
 * 4. Chạy hàm setup() một lần và cấp quyền. Sau đó script tự chạy mỗi 15 phút.
 */
const CFG = {
  OWNER: 'hienp8',
  REPO: 'Dashboard-Watersilk',
  BRANCH: 'main',
  LABEL_OK: 'dashboard-da-xu-ly',
  LABEL_SKIP: 'dashboard-bo-qua',
  ALLOWED_SENDERS: [],   // ví dụ: ['ten.nguoi.gui@congty.com']; để trống sẽ KHÔNG nhận email nào
  QUERY: 'has:attachment (filename:xls OR filename:xlsx) newer_than:14d -label:dashboard-da-xu-ly -label:dashboard-bo-qua',
  DRIVE_FOLDER_ID: ''    // để trống nếu không dùng Google Drive
};

function putFile_(name, bytes) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('Chưa đặt GITHUB_TOKEN trong Script properties');
  const path = 'inbox/' + name.replace(/[\\\/]/g, '_');
  const url = 'https://api.github.com/repos/' + CFG.OWNER + '/' + CFG.REPO + '/contents/' +
    path.split('/').map(encodeURIComponent).join('/');
  const headers = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' };
  const body = { message: 'Tự động nạp báo cáo: ' + name, content: Utilities.base64Encode(bytes), branch: CFG.BRANCH };
  const cur = UrlFetchApp.fetch(url + '?ref=' + CFG.BRANCH, { headers: headers, muteHttpExceptions: true });
  if (cur.getResponseCode() === 200) body.sha = JSON.parse(cur.getContentText()).sha;
  const res = UrlFetchApp.fetch(url, { method: 'put', headers: headers, contentType: 'application/json',
    payload: JSON.stringify(body), muteHttpExceptions: true });
  if (res.getResponseCode() >= 300) throw new Error(name + ': ' + res.getContentText());
}

// Đẩy file kèm ghi chú nguồn (tải ghi chú trước để lịch sử cập nhật có đủ thông tin)
function send_(name, bytes, meta) {
  putFile_(name + '.meta.json', Utilities.newBlob(JSON.stringify(meta)).getBytes());
  putFile_(name, bytes);
}

function emailOf_(from) {
  const m = String(from).match(/<([^>]+)>/);
  return (m ? m[1] : String(from)).trim().toLowerCase();
}

function fromGmail() {
  const ok = GmailApp.getUserLabelByName(CFG.LABEL_OK) || GmailApp.createLabel(CFG.LABEL_OK);
  const skip = GmailApp.getUserLabelByName(CFG.LABEL_SKIP) || GmailApp.createLabel(CFG.LABEL_SKIP);
  const allowed = CFG.ALLOWED_SENDERS.map(function (s) { return s.toLowerCase(); });
  GmailApp.search(CFG.QUERY, 0, 20).forEach(function (thread) {
    let good = true, used = false;
    thread.getMessages().forEach(function (m) {
      const sender = emailOf_(m.getFrom());
      if (allowed.indexOf(sender) < 0) return;          // người gửi chưa được duyệt: bỏ qua
      m.getAttachments().forEach(function (a) {
        if (!/\.xlsx?$/i.test(a.getName())) return;
        used = true;
        try {
          send_(a.getName(), a.getBytes(), { source: 'Gmail', from: sender, subject: m.getSubject(), date: String(m.getDate()) });
        } catch (e) { good = false; console.error(e); }
      });
    });
    if (!good) return;                                   // lỗi: thử lại ở lần chạy sau
    thread.addLabel(used ? ok : skip);
  });
}

function fromDrive() {
  if (!CFG.DRIVE_FOLDER_ID) return;
  const folder = DriveApp.getFolderById(CFG.DRIVE_FOLDER_ID);
  const it = folder.getFoldersByName('da-xu-ly');
  const done = it.hasNext() ? it.next() : folder.createFolder('da-xu-ly');
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (!/\.xlsx?$/i.test(f.getName())) continue;
    try {
      const owner = f.getOwner() ? f.getOwner().getEmail() : 'Google Drive';
      send_(f.getName(), f.getBlob().getBytes(), { source: 'Google Drive', from: owner, date: String(f.getDateCreated()) });
      f.moveTo(done);
    } catch (e) { console.error(e); }
  }
}

function run15() { fromGmail(); fromDrive(); }

function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('run15').timeBased().everyMinutes(15).create();
}
