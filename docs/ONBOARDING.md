# Developer Onboarding & Local Setup Guide

Tài liệu hướng dẫn thiết lập môi trường phát triển cục bộ cho dự án **Gia Đình Xanh Monorepo** theo chiến lược **Zero-Docker + Supabase Cloud**.

---

## 1. System Prerequisites

- **Node.js:** Phiên bản LTS **`v20.x`** (được khóa tại tệp [`.nvmrc`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/.nvmrc) ở thư mục gốc).
- **Package Manager:** **`pnpm`** (`pnpm@9.12.0` kích hoạt qua `corepack`).
- **Cloud Database:** Tài khoản & dự án trên **Supabase** (PostgreSQL 16 tích hợp sẵn `postgis`, `pgcrypto`, `uuid-ossp`).
- **Docker:** **KHÔNG CẦN THIẾT** (Đã loại bỏ hoàn toàn Docker để giải phóng RAM và tránh xung đột cổng `5432` cục bộ).

---

## 2. Step-by-Step Environment Setup

### Bước 1: Chuẩn bị Node.js & kích hoạt `pnpm`
```bash
# Sử dụng phiên bản Node.js theo .nvmrc
nvm use

# Bật corepack để kích hoạt pnpm
corepack enable
corepack prepare pnpm@latest --activate
```

### Bước 2: Khởi tạo dự án Supabase & Cấu hình CSDL
1. Tạo một dự án mới trên Supabase Dashboard (ví dụ: `gia-dinh-xanh-db`).
2. Mở **SQL Editor** trên Supabase Dashboard, dán và thực thi nội dung tệp [`supabase/migrations/00001_init_schema_v2.sql`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/supabase/migrations/00001_init_schema_v2.sql) để kích hoạt `uuid-ossp`, `postgis`, `pgcrypto` và khởi tạo các bảng cốt lõi.
3. Lấy chuỗi kết nối tại **Project Settings > Database > Connection string > URI** (chế độ Transaction Pooler cổng `6543` hoặc Session Pooler cổng `5432`).

### Bước 3: Thiết lập biến môi trường (`.env`)
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

| Tệp cấu hình | Biến môi trường | Mô tả |
|---|---|---|
| `apps/api/.env` | `DATABASE_URL` | Chuỗi kết nối URI tới Supabase PostgreSQL (`?sslmode=require`) |
| `apps/api/.env` | `SUPABASE_URL` | URL dự án Supabase (`https://[PROJECT_REF].supabase.co`) |
| `apps/api/.env` | `JWT_SECRET` | Khóa bí mật ký JWT Token |
| `apps/web/.env` | `VITE_API_URL` | Địa chỉ máy chủ NestJS (`http://localhost:4000/api`) |

### Bước 4: Cài đặt phụ thuộc toàn Monorepo
```bash
pnpm install
```

### Bước 5: Khởi chạy ứng dụng (Development Hot-Reload)
```bash
# Chạy đồng thời cả Frontend (@gdx/web) và Backend (@gdx/api)
pnpm run dev
```
- **Frontend (`apps/web`):** [http://localhost:3000](http://localhost:3000)
- **Backend (`apps/api`):** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 3. Testing & Code Quality Verification

Các câu lệnh chuẩn trích xuất từ [`package.json`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/package.json):
- **Chạy riêng Frontend:** `pnpm run dev:web`
- **Chạy riêng Backend API:** `pnpm run dev:api`
- **Kiểm tra kiểu dữ liệu (Type-check) toàn Monorepo:** `pnpm run lint`
- **Build toàn bộ dự án:** `pnpm run build`
- **Chạy Migration TypeORM:** `pnpm run db:migrate`
- **Tạo Migration TypeORM mới:** `pnpm run db:generate`

---

## 4. Common Pitfalls & Troubleshooting

1. **Lỗi kết nối SSL tới Supabase (`self-signed certificate in certificate chain`):**
   - Trong [`apps/api/src/config/typeorm.config.ts`](file:///d:/hao/Downloads/html/gia-%C4%91%C3%ACnh-xanh---n%E1%BB%81n-t%E1%BA%A3ng-d%E1%BB%8Bch-v%E1%BB%A5-gia-%C4%91%C3%ACnh-5-sao/apps/api/src/config/typeorm.config.ts), tùy chọn `ssl: { rejectUnauthorized: false }` đã được bật sẵn. Hãy đảm bảo chuỗi `DATABASE_URL` trong `apps/api/.env` đúng mật khẩu Database của dự án Supabase.
2. **Lỗi PowerShell chặn chạy script `pnpm.ps1` trên Windows:**
   - Mở PowerShell và chạy: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` (hoặc dùng `pnpm.cmd`).
3. **Lỗi thiếu kiểu dữ liệu từ `@gdx/shared-types`:**
   - Đảm bảo bạn đã chạy `pnpm install` ở thư mục gốc để `pnpm` tạo symlink giữa `apps/web`, `apps/api` và `packages/shared-types`.
