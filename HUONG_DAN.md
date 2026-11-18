# Bản dashboard giao diện tối (Dark Mode)

## Nội dung gói
- `index.html` thay thế trang chính hiện tại.
- `scripts/ingest_reports.py` thay bản cũ cùng tên (thêm đọc file bán hàng "BC BHTP theo ĐT Tháng NN.2026").
- `.github/workflows/ingest.yml` (không đổi so với bản đã gửi trước; chạy `ingest_reports.py` rồi `ingest.py`).

Gói chỉ có thêm một file dữ liệu mới `data/npp.json` (kho xuất nhập tồn nhà phân phối T4/2021–T9/2026, 3.289 dòng). KHÔNG ghi đè `data/data.json`, `data/weekly.json`, `data/ctt.json`, `data/ctbh.json` của bạn.

Sau khi thay file, đưa lại hai file chưa được nạp vào `inbox/` (hoặc Actions → Run workflow → chọn `retry_failed`): `BC_tuan_46.xlsx` và file XNT các khu vực. Báo cáo tuần 46 sẽ thay thế bản cũ của tuần 46 (và sửa lũy kế năm cuộn lớn thành 4.872,1 tấn).

## Các trang cũ không còn cần
Có thể xóa `tuan.html`, `ctt.html`, `ctbh.html` và thư mục `assets/` vì nội dung đã nằm trong các tab của `index.html`.

## Tab và nguồn dữ liệu
| Tab | Nguồn | Tần suất |
|---|---|---|
| Tổng quan | `data.json` (doanh thu, tiêu thụ, kế hoạch, tồn kho) và báo cáo tuần mới nhất | tự động theo các nguồn |
| Sản xuất & tồn kho | BC SX TT Tháng NN (tháng); BC tuần NN (tuần, cả hai dạng "BC TUAN 46" và "BC nhanh") | tháng, tuần |
| Nhà phân phối | BC TIÊU THỤ & XNT TNN (`ctt.json`); xu hướng nhiều năm từ Báo cáo XNT các KV (`npp.json`) | tuần, bản cuối cuối tháng; XNT nhiều tháng khi có file mới |
| Bán hàng thành phẩm | BC BHTP theo ĐT Tháng NN.2026 | tháng |
| Sản lượng tiêu thụ | lấy số tiêu thụ mới nhất từ tab Sản xuất & tồn kho (+ số tuần cho tháng đang chạy) | theo nguồn |
| Bảng giá, Giá đối thủ | `data.json`, `ctbh.json` | khi có thay đổi |

Tab Cập nhật dữ liệu chỉ xem lịch sử và hướng dẫn; tải file qua Drive, Gmail hoặc thư mục `inbox/` trên GitHub.

## Số tháng tạm từ báo cáo tuần (cập nhật)
Khi báo cáo tuần mới nhất thuộc một tháng chưa có BC SX TT tháng, hệ thống tạo dòng tháng tạm: lũy kế tháng = lũy kế năm trong báo cáo tuần − lũy kế năm cuối tháng trước; tồn đầu lấy từ tồn cuối tháng trước; tồn cuối là ước tính (tồn đầu + sản xuất − tiêu thụ). Dòng tạm hiển thị ở Tổng quan, Sản xuất & tồn kho và Sản lượng tiêu thụ (đánh dấu *). Khi nạp BC SX TT của tháng đó, số chốt tự thay thế dòng tạm.
Để có thêm kế hoạch sản xuất và kế hoạch năm từ báo cáo tuần, đưa lại file BC tuần mới nhất vào `inbox/` sau khi thay `scripts/ingest_reports.py`.
