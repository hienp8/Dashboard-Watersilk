# Dashboard Watersilk

Web app tĩnh theo dõi tiêu thụ Watersilk, giấy cuộn lớn và gỗ dán. Không cần máy chủ: mọi xử lý chạy trên trình duyệt.

## Cấu trúc
- `index.html` – ứng dụng (7 tab: Tổng quan, Nhà phân phối, Bán hàng, Sản lượng, Bảng giá, Giá đối thủ, Cập nhật dữ liệu)
- `data/data.json` – toàn bộ dữ liệu đã gộp (bán hàng T1–T9/2026 và cả năm 2025, xuất nhập tồn NPP 4/2021–9/2026, sản lượng 2017–9/2026, khoán khu vực, giá đối thủ T2–T10/2026, bảng giá công ty)

## Chạy trên GitHub Pages
1. Tải toàn bộ nội dung thư mục này lên repo (Add file → Upload files).
2. Settings → Pages → Branch: `main`, thư mục `/ (root)` → Save.
3. Mở địa chỉ `https://<tên-tài-khoản>.github.io/Dashboard-Watersilk/`.

Mở trực tiếp `index.html` từ ổ đĩa sẽ không tải được `data.json` (trình duyệt chặn); khi đó dùng nút "Nạp data.json" ở tab Cập nhật dữ liệu, hoặc chạy `python3 -m http.server`.

## Cập nhật số liệu hàng tháng
1. Mở tab **Cập nhật dữ liệu**, chọn file (có thể chọn nhiều file) rồi bấm **Cập nhật**.
2. App tự nhận dạng 4 loại file Excel (.xls/.xlsx): báo cáo bán hàng theo đối tượng (`BC_BANHANG…`), xuất nhập tồn NPP nhiều tháng (`Báo_cáo_XNT_các_kv…`), so sánh tiêu thụ nhiều năm (`so_sanh_tieu_thu…`), bảng so sánh giá đối thủ. Kỳ lấy từ tên file hoặc từ ô chọn năm/tháng; dữ liệu cùng kỳ bị ghi đè.
3. Dữ liệu cập nhật được lưu trong trình duyệt đang dùng. Để mọi người cùng thấy: bấm **Tải data.json**, thay `data/data.json` trong repo, rồi bấm **Xóa dữ liệu cục bộ**.

## Chưa hỗ trợ
Đọc file Word, ảnh, báo cáo tuần/ngày; cập nhật bảng giá công ty (sửa trong `data/data.json`, mục `prices`); bảng giá siêu thị, Viettel, Shopee/Tiki.

## Lưu ý dữ liệu
- T5/2026 trong file `so_sanh_tieu_thu…` ghi hoán đổi cuộn lớn và thành phẩm; `data.json` đã sửa. Nếu tải lại file gốc chưa sửa, app sẽ cảnh báo các ô bị đổi.
- Bảng giá cuộn lớn lấy từ quyết định 30/6/2023 (từ ảnh), cần kiểm tra còn hiệu lực.
