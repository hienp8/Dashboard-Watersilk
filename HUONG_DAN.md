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

## Báo cáo tuần có cột "Lũy kế tháng" (định dạng mới)
File `BC tuan NN` có thêm cột "Lũy kế tháng" trước cột "Kế hoạch" ở cả SẢN XUẤT và TIÊU THỤ, và ô "Doanh thu tháng" (thực hiện, lũy kế) cạnh "Doanh thu tháng (kế hoạch)". Bộ đọc nhận cột theo tên tiêu đề nên đọc được cả file có và không có các cột này:
- Có cột Lũy kế tháng: dùng đúng số trong file cho sản xuất và tiêu thụ tháng.
- Không có: tự tính = lũy kế năm trong báo cáo tuần − lũy kế năm cuối tháng trước.
- Ô "Doanh thu tháng" là nguồn duy nhất để cộng doanh thu tháng đang chạy (ví dụ 12.143.000 nghìn đồng = 12,14 tỷ đến tuần 46). Nếu thiếu ô này, trang Tổng quan hiện cảnh báo thay vì tự cộng các tuần vì doanh thu từng tuần không cộng khớp.
- Nếu bạn điền cột Tồn đầu và Tồn cuối trong file tuần, hệ thống dùng đúng số đó thay cho số ước tính.
Sau khi thay `scripts/ingest_reports.py` và `index.html`, nạp lại file BC tuần mới nhất (đã có các cột này) vào `inbox/`.

## Quy tắc tồn kho của tháng đang chạy
- Tồn đầu tháng = tồn cuối tháng trước (số chốt).
- Tồn cuối tạm = tồn đầu + sản xuất − tiêu thụ. Riêng cuộn lớn: tồn đầu + sản xuất − tiêu thụ − sản xuất thành phẩm (phần cuộn lớn chuyển sang làm thành phẩm).
- Nếu file báo cáo tuần có điền cột Tồn cuối thì dùng đúng số đó.
- Khi nạp BC SX TT của tháng, số chốt trong báo cáo thay thế hoàn toàn số tạm.
Kiểm chứng trên 10 tháng đã chốt của 2026: thành phẩm khớp tuyệt đối; cuộn lớn lệch trung bình khoảng 30 tấn (tháng 10 chỉ lệch 1,2 tấn), thấp hơn nhiều so với cách không trừ sản xuất thành phẩm (lệch 225–370 tấn mỗi tháng).
