# Developer Onboarding & Local Setup Guide

Chào mừng bạn gia nhập đội ngũ phát triển dự án **Gia Đình Xanh - Nền Tảng Dịch Vụ Gia Đình 5 Sao**! Tài liệu này cung cấp hướng dẫn từng bước (*Zero to Running*) giúp bạn thiết lập môi trường phát triển cục bộ (Local Development Environment), kiểm tra chất lượng mã nguồn và xử lý các sự cố thường gặp một cách nhanh chóng, chuẩn xác.

---

## 1. System Prerequisites

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

### 1.1. Công Cụ & Phiên Bản Yêu Cầu
- **Node.js**: Phiên bản **LTS `>= 20.x`** (tối thiểu `>= 18.18.0`).
  - *Lý do:* Hệ thống sử dụng React 19 (`^19.0.1`), Vite 8 (`^8.3.0`) và Tailwind CSS v4 (`^4.3.3`) đòi hỏi runtime Node.js hiện đại hỗ trợ đầy đủ các tính năng ESM và CSS variables `@theme`.
- **Package Manager**: **npm** (đi kèm sẵn với Node.js, phiên bản `>= 10.x`) hoặc **Bun** (`>= 1.1.x` - dự án có tệp `bun.lock` tại thư mục gốc).
- **Git**: Phiên bản `>= 2.30.0`.
- **Docker Engine & Docker Compose**: **Not configured / Not required**.
  - *Lưu ý:* Dự án hiện là Client-Side Prototype sử dụng Mock Data in-memory, không cần chạy bất kỳ container backend hay cơ sở dữ liệu phụ trợ nào.
- **GNU Make**: **Not configured / Not required** (Dự án quản lý tác vụ thông qua npm scripts trong `package.json`, không có `Makefile`).

### 1.2. Công Cụ Quản Lý Phiên Bản Runtime Khuyến Nghị
Để tránh xung đột phiên bản Node giữa các dự án, bạn nên sử dụng một trong các công cụ sau:
- **macOS / Linux**:
  - [`nvm`](https://github.com/nvm-sh/nvm):
    ```bash
    nvm install 20
    nvm use 20
    ```
  - [`fnm`](https://github.com/Schniz/fnm) (Fast Node Manager viết bằng Rust - tốc độ cực nhanh).
- **Windows**:
  - [`nvm-windows`](https://github.com/coreybutler/nvm-windows) hoặc [`fnm`](https://github.com/Schniz/fnm).

---

## 2. Step-by-Step Environment Setup

Thực hiện tuần tự các bước dưới đây từ cửa sổ dòng lệnh (Terminal / Shell):

### Bước 1: Clone Mã Nguồn & Cấu Hình Biến Môi Trường
1. Sao chép kho mã nguồn về máy cục bộ:
   ```bash
   git clone <REPOSITORY_URL>
   cd gia-đình-xanh---nền-tảng-dịch-vụ-gia-đình-5-sao
   ```

2. Tạo tệp cấu hình môi trường cục bộ từ tệp mẫu `.env.example` (theo hướng dẫn chuẩn của dự án trong `README.md`):
   ```bash
   cp .env.example .env.local
   ```

3. Bảng chú thích các biến môi trường từ `.env.example`:
   | Tên Biến | Giá Trị Mặc Định (`.env.example`) | Bắt Buộc Đổi? | Mục Đích Kỹ Thuật & Hướng Dẫn |
   |:---|:---|:---|:---|
   | `GEMINI_API_KEY` | `"MY_GEMINI_API_KEY"` | **Không bắt buộc cho UI local** | Khóa API Google Gemini. Dùng khi kích hoạt chức năng GenAI trên môi trường Google AI Studio. Ở môi trường local demo giao diện, bạn có thể giữ nguyên giá trị mẫu. |
   | `APP_URL` | `"MY_APP_URL"` | **Không bắt buộc cho UI local** | URL gốc triển khai của ứng dụng (Cloud Run URL trong AI Studio). Khi chạy local, ứng dụng tự động nhận diện `http://localhost:3000`. |

---

### Bước 2: Infrastructure Initialization (Docker)
- **Trạng thái:** **Not configured / Not required**.
- **Giải thích:** Bạn **không cần** chạy lệnh Docker (`docker compose up`) hay dựng bất kỳ cơ sở dữ liệu nào (PostgreSQL, MongoDB, Redis, RabbitMQ). Ứng dụng vận hành hoàn toàn độc lập ở phía Client với dữ liệu thử nghiệm được nạp sẵn.

---

### Bước 3: Dependency Installation (Cài Đặt Thư Viện)
Cài đặt chính xác các phụ thuộc mã nguồn theo cấu hình dự án:

```bash
# Lựa chọn 1 (Khuyến nghị chuẩn theo README.md):
npm install

# Lựa chọn 2 (Nếu sử dụng Bun theo lockfile bun.lock):
bun install
```

> [!TIP]
> Lệnh `npm install` sẽ tự động giải quyết cây phụ thuộc chính xác bao gồm React 19, Tailwind CSS v4, Motion, Lucide Icons và Vite.

---

### Bước 4: Database Migration & Seeding
- **Trạng thái:** **Not configured / Not required**.
- **Cơ chế nạp dữ liệu:** Dự án **không có database vật lý** hay công cụ migration (Prisma/TypeORM/Knex).
- Toàn bộ dữ liệu nghiệp vụ mẫu bao gồm:
  - 5 đơn hàng mẫu đa trạng thái (`INITIAL_ORDERS`)
  - 4 hồ sơ thẩm định đối tác kèm bằng chứng CCCD/Lý lịch tư pháp (`KYC_CANDIDATES`)
  - Ảnh chân dung và ảnh chụp nghiệm thu Before/After
  được khởi tạo tự động trong bộ nhớ RAM từ tệp [`src/data/mockData.ts`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/src/data/mockData.ts) khi khởi động ứng dụng.

---

### Bước 5: Starting the Application (Khởi Chạy Ứng Dụng)
Chạy ứng dụng ở chế độ phát triển (Development Mode) có hỗ trợ Hot Module Reloading (HMR):

```bash
npm run dev
```

*(Lệnh này thực thi script được định nghĩa trong `package.json`: `vite --port=3000 --host=0.0.0.0`)*

#### Địa Chỉ Truy Cập Mặc Định:
- **Local Browser:** [http://localhost:3000](http://localhost:3000)
- **Network IP (Mạng LAN):** `http://<IP_MÁY_BẠN>:3000` (nhờ cờ cấu hình `--host=0.0.0.0`, bạn có thể mở đường dẫn này trên điện thoại thông minh cùng mạng Wi-Fi để trải nghiệm phân hệ đối tác / khách hàng).

#### Cách Điều Hướng Các Phân Hệ:
Hệ thống tích hợp sẵn thanh điều hướng nổi **`PlatformSwitcher`** ở góc dưới cùng bên phải màn hình. Bạn có thể nhấp vào đó để chuyển đổi tức thì giữa 10 màn hình chức năng:
1. **Phân hệ Khách hàng:** Trang chủ & đặt nhanh, Wizard cấu hình dịch vụ, Live Tracking tiến độ, Lịch hẹn & Popup đánh giá 5 sao.
2. **Phân hệ Đối tác:** Ca làm việc & Timer hiện trường, Sàn việc làm radar GPS, Quản lý ví thu nhập & Ma trận lịch rảnh.
3. **Phân hệ Quản trị:** Dashboard điều hành & điều phối thợ, Pricing Engine Sandbox, Xét duyệt hồ sơ đối tác KYC.

---

## 3. Testing & Code Quality Verification

Dưới đây là các câu lệnh kiểm tra chất lượng mã nguồn trích xuất trực tiếp từ `scripts` trong [`package.json`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/package.json):

### 3.1. Linter & Type Checking (Kiểm Tra Lỗi Kiểu Dữ Liệu)
Chạy kiểm tra tĩnh TypeScript trên toàn bộ codebase mà không sinh tệp output:
```bash
npm run lint
```
*(Lệnh thực thi trực tiếp: `tsc --noEmit` theo cấu hình nghiêm ngặt của `tsconfig.json`)*

### 3.2. Clean Build Artifacts (Dọn Dẹp Thư Mục Build)
Xóa thư mục `dist` và các tệp build tạm:
```bash
npm run clean
```
*(Lệnh thực thi: `rm -rf dist server.js`)*

### 3.3. Production Build & Static Preview (Đóng Gói & Xem Trước)
Kiểm tra khả năng biên dịch đóng gói sản phẩm hoàn chỉnh:
```bash
# Biên dịch mã nguồn thành tài nguyên tĩnh tối ưu:
npm run build

# Chạy server thử nghiệm bản build tĩnh:
npm run preview
```

### 3.4. Unit Test & E2E Test
- **Unit Test:** **Not configured/Found** trong `package.json` (chưa tích hợp Jest/Vitest).
- **Integration / E2E Test:** **Not configured/Found** trong `package.json` (chưa tích hợp Playwright/Cypress).

---

## 4. Common Pitfalls & Troubleshooting

### 4.1. Lỗi Mismatch Phiên Bản Node.js Runtime
- **Hiện tượng:** Khi chạy `npm install` hoặc `npm run dev`, xuất hiện cảnh báo lỗi cú pháp hoặc crash:
  ```text
  SyntaxError: Unexpected token '?'
  or TypeError: Unknown file extension ".ts"
  ```
- **Nguyên nhân:** Phiên bản Node.js trên máy bạn quá cũ (ví dụ Node.js 14 hoặc 16) không tương thích với React 19, TypeScript 5+ và Vite 8.
- **Cách khắc phục:**
  Kiểm tra phiên bản hiện tại bằng lệnh `node -v`. Nếu nhỏ hơn `20.0.0`, chuyển sang Node 20:
  ```bash
  nvm install 20
  nvm use 20
  ```

---

### 4.2. Lỗi Xung Đột Cổng 3000 (`EADDRINUSE: address already in use 0.0.0.0:3000`)
- **Hiện tượng:** Terminal báo lỗi cổng 3000 đã bị chiếm dụng:
  ```text
  Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
  ```
- **Nguyên nhân:** Script `npm run dev` được cấu hình cứng tham số `--port=3000`. Một tiến trình khác (hoặc tab terminal Vite cũ chưa tắt) đang lắng nghe trên cổng 3000.
- **Cách khắc phục:**
  - **Trên Windows (PowerShell):**
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
    ```
  - **Trên macOS / Linux:**
    ```bash
    lsof -ti :3000 | xargs kill -9
    ```
  - **Hoặc ghi đè cổng tạm thời:**
    ```bash
    npx vite --port=3001 --host=0.0.0.0
    ```

---

### 4.3. Lỗi Mất Tính Năng Hot Reload (HMR Không Cập Nhật Khi Đổi Code)
- **Hiện tượng:** Bạn sửa code trong `src/App.tsx` hoặc các component nhưng trình duyệt không tự cập nhật giao diện, phải F5 bằng tay.
- **Nguyên nhân:** Trong tệp [`vite.config.ts`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/vite.config.ts), HMR và bộ theo dõi tệp (file watcher) bị vô hiệu hóa nếu phát hiện biến môi trường `DISABLE_HMR="true"`:
  ```typescript
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  }
  ```
- **Cách khắc phục:**
  Xóa bỏ hoặc đặt lại biến môi trường này trước khi khởi động dev server:
  - **Linux / macOS:** `unset DISABLE_HMR && npm run dev`
  - **Windows (PowerShell):** `$env:DISABLE_HMR="" ; npm run dev`
  - **Windows (CMD):** `set DISABLE_HMR= && npm run dev`

---

### 4.4. Lỗi Chạy Script `npm run clean` Trên Môi Trường Windows Command Prompt (CMD)
- **Hiện tượng:** Khi chạy `npm run clean`, xuất hiện thông báo lỗi:
  ```text
  'rm' is not recognized as an internal or external command, operable program or batch file.
  ```
- **Nguyên nhân:** Script `"clean": "rm -rf dist server.js"` sử dụng lệnh Unix `rm`.
- **Cách khắc phục:**
  - Sử dụng **Git Bash**, **WSL** hoặc **PowerShell** có alias `rm`.
  - Hoặc trên PowerShell chạy lệnh native tương đương:
    ```powershell
    Remove-Item -Recurse -Force dist, server.js -ErrorAction SilentlyContinue
    ```

---

### 4.5. Tránh Mất Thời Gian Tìm Kiếm Cơ Sở Dữ Liệu & Docker
- **Hiểu lầm thường gặp:** Lập trình viên mới cố gắng tìm tệp `.sql`, cấu hình PostgreSQL hay `docker-compose.yml` để nạp dữ liệu người dùng.
- **Thực tế:** Không cần cấu hình bất kỳ kết nối CSDL nào. Toàn bộ tính năng (đặt lịch, phân phối việc, duyệt hồ sơ KYC, tính giá sandbox) đều hoạt động tức thì ngay sau `npm run dev`.
