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

## Phân quyền và lịch sử cập nhật
- **Xem:** ai mở trang cũng xem được số liệu.
- **Cập nhật từ trình duyệt:** tab *Cập nhật dữ liệu* yêu cầu đăng nhập. Lần đầu mở tab sẽ tạo tài khoản quản trị; quản trị viên thêm tài khoản cho người khác (mật khẩu được mã hóa SHA-256, không lưu dạng gốc). Sau khi tạo tài khoản, bấm "Tải data.json" và thay file `data/data.json` trong repo để các máy khác dùng chung danh sách tài khoản.
- **Giới hạn:** đăng nhập trong trang web chỉ để kiểm soát thao tác và ghi tên người cập nhật. Vì trang là tĩnh, mật khẩu được kiểm tra ngay trên trình duyệt và số liệu tải lên trình duyệt chỉ lưu cục bộ. Quyền thay đổi số liệu dùng chung thật sự nằm ở: (1) ai có quyền ghi vào repo GitHub (nên bật bảo vệ nhánh `main`); (2) danh sách email được duyệt `ALLOWED_SENDERS` trong Apps Script; (3) ai được chia sẻ thư mục Drive.
- **Lịch sử:** mọi lần cập nhật được ghi vào mục "Lịch sử cập nhật" (thời gian, file, nguồn: Trình duyệt / Gmail / Google Drive / GitHub, người cập nhật hoặc email người gửi, loại dữ liệu, kết quả). Cập nhật tự động ghi bằng `scripts/ingest.py`; file không đọc được được chuyển vào `inbox/failed/` và ghi là Lỗi.

## Cập nhật thủ công
Tab **Cập nhật dữ liệu** (sau khi đăng nhập): chọn một hoặc nhiều file .xls/.xlsx rồi bấm Cập nhật. Nhận dạng tự động: báo cáo sản xuất và tiêu thụ tháng (`BC_SX_TT…`), báo cáo tuần `BC TIÊU THỤ & XNT…`, báo cáo bán hàng theo đối tượng (`BC_BANHANG…`), XNT NPP nhiều tháng (`Báo_cáo_XNT_các_kv…`), so sánh giá đối thủ, so sánh tiêu thụ nhiều năm. Dữ liệu lưu trong trình duyệt; để dùng chung, bấm "Tải data.json", thay file `data/data.json` trong repo rồi "Xóa dữ liệu cục bộ".

## Cập nhật tự động từ Gmail hoặc Google Drive
Quy trình: email hoặc thư mục Drive → (Google Apps Script) → thư mục `inbox/` trong repo → (GitHub Actions chạy `scripts/ingest.py`) → `data/data.json` cập nhật và ghi lịch sử → trang web tự có số mới.
1. File `.github/workflows/ingest.yml` đã có sẵn trong repo.
2. Dán `scripts/gmail_drive_to_github.gs` vào script.google.com, làm theo hướng dẫn ở đầu file: tạo GitHub token chỉ cấp quyền cho repo này, đặt `GITHUB_TOKEN`, điền `ALLOWED_SENDERS` (danh sách email được phép; để trống thì không nhận email nào), chạy `setup()` một lần.
3. Có thể bỏ file vào `inbox/` trên GitHub bằng tay; Actions xử lý và chuyển sang `inbox/processed/`.

## Lưu ý dữ liệu
- T5/2026 trong file `so_sanh_tieu_thu…` ghi hoán đổi cuộn lớn và thành phẩm; `data.json` đã sửa và app cảnh báo nếu nạp lại file gốc chưa sửa.
- Số tháng 10 của NPP và khoán lấy từ báo cáo tuần (đến ngày 24/10) cho tới khi có báo cáo đầy đủ tháng.
- Bảng giá cuộn lớn lấy từ quyết định 30/6/2023, cần kiểm tra còn hiệu lực.
- Chưa đọc được file Word, ảnh; chưa có số liệu theo ngày hoặc kênh bán hàng.
