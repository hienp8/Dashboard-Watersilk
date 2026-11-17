# Bản dashboard giao diện tối (Dark Mode)

## Nội dung gói
- `index.html` thay thế trang chính hiện tại.
- `scripts/ingest_reports.py` thay bản cũ cùng tên (thêm đọc file bán hàng "BC BHTP theo ĐT Tháng NN.2026").
- `.github/workflows/ingest.yml` (không đổi so với bản đã gửi trước; chạy `ingest_reports.py` rồi `ingest.py`).

KHÔNG có file dữ liệu trong gói để không ghi đè dữ liệu bạn đang có. Giữ nguyên `data/data.json`, `data/weekly.json`, `data/ctt.json`, `data/ctbh.json`.

## Các trang cũ không còn cần
Có thể xóa `tuan.html`, `ctt.html`, `ctbh.html` và thư mục `assets/` vì nội dung đã nằm trong các tab của `index.html`.

## Tab và nguồn dữ liệu
| Tab | Nguồn | Tần suất |
|---|---|---|
| Tổng quan | `data.json` (doanh thu, tiêu thụ, kế hoạch, tồn kho) và báo cáo tuần mới nhất | tự động theo các nguồn |
| Sản xuất & tồn kho | BC SX TT Tháng NN (tháng), BC tuần NN (tuần) | tháng, tuần |
| Nhà phân phối | BC TIÊU THỤ & XNT TNN (`ctt.json`); xu hướng nhiều năm từ XNT hàng tháng | tuần, bản cuối cuối tháng |
| Bán hàng thành phẩm | BC BHTP theo ĐT Tháng NN.2026 | tháng |
| Sản lượng tiêu thụ | lấy số tiêu thụ mới nhất từ tab Sản xuất & tồn kho (+ số tuần cho tháng đang chạy) | theo nguồn |
| Bảng giá, Giá đối thủ | `data.json`, `ctbh.json` | khi có thay đổi |

Tab Cập nhật dữ liệu chỉ xem lịch sử và hướng dẫn; tải file qua Drive, Gmail hoặc thư mục `inbox/` trên GitHub.
