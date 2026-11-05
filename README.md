# Dashboard Watersilk

Web app tĩnh theo dõi sản xuất, tiêu thụ, tồn kho, doanh thu và bán hàng thành phẩm của Watersilk, giấy cuộn lớn và gỗ dán. Chạy hoàn toàn trên trình duyệt.

## Các tab
- **Tổng quan:** doanh thu so với kế hoạch; từng sản phẩm (cuộn lớn, gỗ dán, thành phẩm) với tiêu thụ, % kế hoạch tháng, % kế hoạch năm, sản xuất, tồn cuối. Bán hàng thành phẩm có các mục con: doanh số bán hàng, NPP nhập – xuất, khoán doanh số.
- **Sản xuất & tồn kho:** bảng theo dõi tồn đầu, sản xuất, tiêu thụ, tồn cuối theo tháng và theo từng sản phẩm; kế hoạch tháng và năm.
- **Nhà phân phối:** biểu đồ xu hướng nhập/xuất/tồn qua các năm, bảng xuất nhập tồn có STT và dòng tổng cộng, NPP tồn kho cao.
- **Bán hàng thành phẩm:** doanh số theo nhóm sản phẩm, top mã hàng, mã hàng chậm tiêu thụ, khách hàng lớn.
- **Sản lượng:** so sánh nhiều năm (2017 đến nay) bằng biểu đồ đường, cột và bảng.
- **Bảng giá** (thành phẩm, cuộn lớn, gỗ dán) và **Giá đối thủ**.
- **Cập nhật dữ liệu:** tải file báo cáo lên để cập nhật.

## Chạy trên GitHub Pages
1. Tải toàn bộ nội dung thư mục này lên repo (kể cả thư mục ẩn `.github`).
2. Settings → Pages → Branch `main`, thư mục root → Save.
3. Mở `https://<tài-khoản>.github.io/Dashboard-Watersilk/`.

Lưu ý riêng tư: nếu repo ở chế độ công khai thì `data/data.json` (số liệu kinh doanh) cũng công khai. Dùng repo riêng tư và gói GitHub hỗ trợ Pages riêng tư, hoặc không đưa số liệu nhạy cảm lên.

## Cập nhật thủ công
Tab **Cập nhật dữ liệu**: chọn một hoặc nhiều file .xls/.xlsx rồi bấm Cập nhật. Nhận dạng tự động 6 loại: báo cáo sản xuất và tiêu thụ tháng (`BC_SX_TT…`), báo cáo tiêu thụ và XNT hàng tuần (`BC TIÊU THỤ & XNT…`), báo cáo bán hàng theo đối tượng (`BC_BANHANG…`), XNT NPP nhiều tháng (`Báo_cáo_XNT_các_kv…`), so sánh giá đối thủ, so sánh tiêu thụ nhiều năm. Dữ liệu lưu trong trình duyệt; để dùng chung, bấm "Tải data.json", thay file `data/data.json` trong repo rồi "Xóa dữ liệu cục bộ".

## Cập nhật tự động từ Gmail hoặc Google Drive
Quy trình: email hoặc thư mục Drive → (Google Apps Script) → thư mục `inbox/` trong repo → (GitHub Actions chạy `scripts/ingest.py`) → `data/data.json` cập nhật → trang web tự có số mới.
1. File `.github/workflows/ingest.yml` đã có sẵn trong repo; không cần cấu hình thêm.
2. Dán `scripts/gmail_drive_to_github.gs` vào script.google.com, làm theo hướng dẫn ở đầu file (tạo GitHub token chỉ cấp quyền cho repo này, đặt `GITHUB_TOKEN`, chạy `setup()` một lần). Script quét Gmail theo `CFG.QUERY` và/hoặc thư mục Drive mỗi 15 phút.
3. Cũng có thể bỏ file vào thư mục `inbox/` trên GitHub bằng tay; Actions sẽ xử lý và chuyển file sang `inbox/processed/`.
`scripts/ingest.py` cần `pip install openpyxl xlrd` (đã có trong workflow).

## Lưu ý dữ liệu
- T5/2026 trong file `so_sanh_tieu_thu…` ghi hoán đổi cuộn lớn và thành phẩm; `data.json` đã sửa và app cảnh báo nếu nạp lại file gốc chưa sửa.
- Số tháng 10 của NPP và khoán lấy từ báo cáo tuần (đến ngày 24/10) cho tới khi có báo cáo đầy đủ tháng.
- Bảng giá cuộn lớn lấy từ quyết định 30/6/2023, cần kiểm tra còn hiệu lực.
- Chưa đọc được file Word, ảnh; chưa có số liệu theo ngày hoặc kênh bán hàng.
