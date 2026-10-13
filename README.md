# Gia Đình Xanh — Nền Tảng Dịch Vụ Gia Đình 5 Sao (Monorepo)

Nền tảng sàn dịch vụ gia đình 3 bên (**Khách hàng**, **Đối tác/Thợ hiện trường**, **Quản trị vận hành**) được quy hoạch theo kiến trúc **Monorepo (`pnpm` Workspaces + `Turborepo`)** kết hợp cơ sở dữ liệu đám mây **Supabase (Managed PostgreSQL 16 + PostGIS + pgcrypto)**, loại bỏ hoàn toàn gánh nặng chạy Docker cục bộ.

---

## 1. Kiến Trúc Tổng Quan & Ngăn Xếp Công Nghệ

| Tầng kiến trúc | Công nghệ | Vai trò |
|---|---|---|
| **Monorepo Manager** | `pnpm` Workspaces + `Turborepo` | Quản lý phụ thuộc cô lập, chống phantom dependencies, chạy song song và cache tác vụ build/dev. |
| **Frontend (`apps/web`)** | React 19, Vite 6, Tailwind CSS v4, Motion, Lucide Icons, Axios | Trải nghiệm 10 màn hình chức năng của 3 phân hệ, tốc độ khởi động tức thì. |
| **Backend (`apps/api`)** | NestJS 10, TypeORM, Passport JWT, Class Validator | Kiến trúc 11 Domain Modules, RBAC Guards, Exception Filters, kết nối Supabase qua SSL Pooler. |
| **Shared (`packages/*`)** | `@gdx/shared-types`, `@gdx/tsconfig` | Đồng bộ Types, Enums, Interfaces, DTOs và cấu hình TypeScript giữa Frontend và Backend. |
| **Database (`supabase/`)** | Supabase Cloud (PostgreSQL 16 + PostGIS + pgcrypto) | CSDL đám mây không xung đột cổng 5432 cục bộ, tích hợp radar không gian GiST và mã hóa tài chính. |

---

## 2. Cấu Trúc Thư Mục Monorepo

```text
gia-dinh-xanh/
├── apps/
│   ├── api/                        # [BACKEND] Ứng dụng máy chủ NestJS (@gdx/api - Port 4000)
│   └── web/                        # [FRONTEND] Ứng dụng React 19 + Vite (@gdx/web - Port 3000)
├── packages/
│   ├── shared-types/               # Types, Enums, Interfaces, DTOs dùng chung (@gdx/shared-types)
│   └── tsconfig/                   # Cấu hình TypeScript cơ sở (@gdx/tsconfig)
├── supabase/
│   └── migrations/
│       └── 00001_init_schema_v2.sql # Script kích hoạt PostGIS, pgcrypto, uuid-ossp & Schema v2.0.0
├── docs/                           # Tài liệu kiến trúc (ARCHITECTURE.md, SERVICES.md, ONBOARDING.md)
├── .nvmrc                          # Khóa phiên bản Node.js (v20)
├── package.json                    # Root scripts điều phối Turborepo
├── pnpm-workspace.yaml             # Khai báo pnpm workspaces
└── turbo.json                      # Pipeline Turborepo
```

---

## 3. Hướng Dẫn Khởi Chạy Nhanh (Zero Docker)

### Bước 1: Chuẩn bị Node.js & `pnpm`
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Bước 2: Thiết lập biến môi trường
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```
*(Điền chuỗi kết nối `DATABASE_URL` từ Supabase Dashboard vào `apps/api/.env`)*.

### Bước 3: Cài đặt phụ thuộc & Khởi chạy
```bash
pnpm install
pnpm run dev
```

- **Frontend (`@gdx/web`):** [http://localhost:3000](http://localhost:3000)
- **Backend API (`@gdx/api`):** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 4. Sổ Tay Lệnh Thường Dùng (Developer Cheatsheet)

```bash
# Chạy đồng thời cả Frontend và Backend (Hot-reload)
pnpm run dev

# Chỉ chạy giao diện Frontend (Port 3000)
pnpm run dev:web

# Chỉ chạy máy chủ Backend API (Port 4000)
pnpm run dev:api

# Kiểm tra kiểu dữ liệu (Type-check) toàn Monorepo
pnpm run lint

# Build toàn bộ các gói và ứng dụng
pnpm run build

# Chạy Migration TypeORM lên Supabase PostgreSQL
pnpm run db:migrate
```
