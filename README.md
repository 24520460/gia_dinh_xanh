# Gia Đình Xanh - Nền Tảng Dịch Vụ Gia Đình 5 Sao
## Kiến Trúc Static Web Native (HTML5, CSS3 & ES Modules)

Dự án đã được tái cấu trúc toàn diện thành nền tảng **Static Web Native** độc lập:
- **Không cần công cụ đóng gói:** Loại bỏ hoàn toàn Node.js, Vite, npm, build step.
- **Khởi chạy tức thì (Zero-Config):** Chạy trực tiếp chỉ với một lệnh duy nhất.
- **Chia sẻ trạng thái qua LocalStorage:** Luồng dữ liệu giữa Khách hàng, Đối tác và Quản trị viên được đồng bộ tự động.

---

## Khởi Chạy Nhanh (Instant Run)

### 1. Yêu cầu duy nhất
Máy tính đã cài đặt sẵn **Python** (phiên bản 3.x).

### 2. Lệnh khởi chạy
Mở cửa sổ dòng lệnh (Terminal / Command Prompt / PowerShell) tại thư mục dự án và chạy:

```bash
# Trên Windows:
py -m http.server 8000

# Hoặc:
python -m http.server 8000

# Trên macOS / Linux:
python3 -m http.server 8000
```

### 3. Trải nghiệm ứng dụng
Mở trình duyệt bất kỳ và truy cập:
👉 **[http://localhost:8000](http://localhost:8000)**

Nhìn xuống góc dưới bên phải màn hình: Nhấp vào nút **"10 Màn Hình Demo"** để chuyển đổi tức thì giữa các phân hệ:
- **Phân hệ Khách hàng:** Trang chủ (`index.html`), Cấu hình đặt lịch (`customer-booking.html`), Theo dõi live (`customer-tracking.html`), Lịch hẹn & đánh giá (`customer-appointments.html`).
- **Phân hệ Đối tác:** Sàn nhận việc radar GPS (`partner-jobs.html`), Ca làm việc & checklist (`partner-shift.html`), Quản lý ví & lịch rảnh (`partner-wallet.html`).
- **Phân hệ Quản trị:** Bảng điều hành (`admin-dashboard.html`), Sandbox chính sách giá (`admin-pricing.html`), Thẩm định KYC (`admin-kyc.html`).

---

## Cấu Trúc Mã Nguồn

```text
├── index.html                     # [Customer] Trang chủ & Đặt nhanh
├── customer-booking.html          # [Customer] Wizard cấu hình dịch vụ & Đặt hẹn
├── customer-tracking.html         # [Customer] Giám sát ca làm việc Live & Đánh giá 5 sao
├── customer-appointments.html     # [Customer] Danh sách lịch hẹn & Lịch sử dịch vụ
├── partner-jobs.html              # [Partner] Sàn nhận việc khẩn cấp & Radar GPS
├── partner-shift.html             # [Partner] Ca làm việc trực tiếp, Đồng hồ & Checklist
├── partner-wallet.html            # [Partner] Ví thu nhập & Ma trận đăng ký lịch rảnh
├── admin-dashboard.html           # [Admin] Điều hành đơn hàng & Điều phối thợ
├── admin-pricing.html             # [Admin] Công cụ mô phỏng chính sách giá Dynamic
├── admin-kyc.html                 # [Admin] Thẩm định hồ sơ đối tác 4 bước
├── css/
│   ├── theme.css                  # Biến màu sắc chuẩn CSS (:root), typography & reset
│   └── animations.css             # Keyframe animations (radar pulse, modal bounce, toast)
└── js/
    ├── data/mockData.js           # Dữ liệu khởi tạo ES Module
    ├── store.js                   # Quản trị State tập trung qua localStorage & Event Bus
    ├── components/
    │   ├── platformSwitcher.js    # Thanh điều hướng nổi 10 màn hình
    │   └── ratingModal.js         # Popup đánh giá 5 sao & Tip tiền
    └── pages/                     # Logic tương tác DOM riêng biệt cho 10 trang
```
