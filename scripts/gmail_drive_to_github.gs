/**
 * Google Apps Script: tự động đưa file báo cáo (.xls/.xlsx) từ Gmail hoặc thư mục Google Drive
 * vào thư mục inbox/ của repo GitHub. GitHub Actions sẽ đọc file và cập nhật data/data.json.
 *
 * Cài đặt (làm một lần):
 * 1. Vào script.google.com, tạo dự án mới, dán toàn bộ mã này.
 * 2. Tạo GitHub token (Settings > Developer settings > Fine-grained tokens): chỉ chọn repo Dashboard-Watersilk,
 *    quyền Contents = Read and write. Trong Apps Script: Project Settings > Script properties > thêm GITHUB_TOKEN.
 * 3. Sửa CFG bên dưới (OWNER, REPO, QUERY hoặc DRIVE_FOLDER_ID).
 * 4. Chạy hàm setup() một lần, cấp quyền khi được hỏi. Sau đó script tự chạy mỗi 15 phút.
 */
const CFG = {
  OWNER: 'hienp8',
  REPO: 'Dashboard-Watersilk',
  BRANCH: 'main',
  LABEL: 'dashboard-da-xu-ly',
  // Chỉ lấy thư có file Excel đính kèm; thêm "from:địa_chỉ_người_gửi" hoặc "subject:BC" để lọc chặt hơn
  QUERY: 'has:attachment (filename:xls OR filename:xlsx) newer_than:14d -label:dashboard-da-xu-ly',
  DRIVE_FOLDER_ID: '' // để trống nếu không dùng Google Drive
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

function fromGmail() {
  const label = GmailApp.getUserLabelByName(CFG.LABEL) || GmailApp.createLabel(CFG.LABEL);
  GmailApp.search(CFG.QUERY, 0, 20).forEach(function (thread) {
    let ok = true;
    thread.getMessages().forEach(function (m) {
      m.getAttachments().forEach(function (a) {
        if (/\.xlsx?$/i.test(a.getName())) {
          try { putFile_(a.getName(), a.getBytes()); } catch (e) { ok = false; console.error(e); }
        }
      });
    });
    if (ok) thread.addLabel(label);   // chỉ gắn nhãn khi tất cả file đã gửi thành công
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
    try { putFile_(f.getName(), f.getBlob().getBytes()); f.moveTo(done); } catch (e) { console.error(e); }
  }
}

function run15() { fromGmail(); fromDrive(); }

function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('run15').timeBased().everyMinutes(15).create();
}
