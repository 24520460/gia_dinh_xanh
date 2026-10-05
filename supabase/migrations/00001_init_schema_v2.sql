-- =====================================================================
--  GIA ĐÌNH XANH — ALL-IN-ONE cho Supabase SQL Editor (v2.1)
--  Thiết kế v2.0.0 + các bản vá.
--  Dùng cho project MỚI. Chạy 1 lần từ đầu đến cuối.
--  - Phần A (BEGIN…COMMIT): schema, hàm, trigger, RLS, phân quyền — all-or-nothing.
--  - Phần B: dữ liệu tham chiếu (idempotent).
--  - Phần C: self-test (chạy trong subtransaction rồi ROLLBACK, không để lại dữ liệu).
-- =====================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis  WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
SET LOCAL search_path = public, extensions;

-- ---------------------------------------------------------------------
-- 01. Tiện ích chung
-- ---------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.order_code_seq
  AS BIGINT INCREMENT BY 1 START WITH 100000 NO CYCLE;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END $$;

-- ---------------------------------------------------------------------
-- 02. Địa giới hành chính
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provinces (
  code   VARCHAR(10) PRIMARY KEY,
  name   VARCHAR(100) NOT NULL,
  region VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.wards (
  code          VARCHAR(10) PRIMARY KEY,
  province_code VARCHAR(10) NOT NULL REFERENCES public.provinces(code),
  name          VARCHAR(100) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_wards_province ON public.wards (province_code);

-- ---------------------------------------------------------------------
-- 03. Người dùng & định danh
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name            VARCHAR(100) NOT NULL,
  phone                VARCHAR(15) UNIQUE NOT NULL CHECK (phone ~ '^\+?[0-9]{9,14}$'),
  email                VARCHAR(100),
  password_hash        VARCHAR(255) NOT NULL,
  role                 VARCHAR(20) NOT NULL CHECK (role IN ('customer','partner','admin')),
  avatar_url           TEXT,
  customer_star_rating NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (customer_star_rating BETWEEN 1 AND 5),
  status               VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','inactive')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_users_email_lower ON public.users (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role_status ON public.users (role, status);

CREATE TABLE IF NOT EXISTS public.user_addresses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label        VARCHAR(50),
  address_line VARCHAR(255) NOT NULL,
  ward_code    VARCHAR(10) NOT NULL REFERENCES public.wards(code),
  location     geography(Point, 4326) NOT NULL,
  is_default   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.otp_codes (
  id          BIGSERIAL PRIMARY KEY,
  phone       VARCHAR(15) NOT NULL,
  otp_hash    VARCHAR(255) NOT NULL,
  purpose     VARCHAR(20) NOT NULL CHECK (purpose IN ('login','register','reset_password')),
  attempts    SMALLINT NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otp_phone_created ON public.otp_codes (phone, created_at DESC);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
  device_info        VARCHAR(255),
  ip_address         INET,
  expires_at         TIMESTAMPTZ NOT NULL,
  revoked_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions (user_id);

-- ---------------------------------------------------------------------
-- 04. Dịch vụ, vùng & cấu hình giá
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_categories (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  code             VARCHAR(20) UNIQUE NOT NULL,
  description      TEXT,
  base_hourly_rate NUMERIC(12,2) NOT NULL CHECK (base_hourly_rate >= 0),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.service_addons (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code          VARCHAR(20) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  default_price NUMERIC(12,2) NOT NULL CHECK (default_price >= 0),
  unit          VARCHAR(20) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.service_zones (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  province_code VARCHAR(10) REFERENCES public.provinces(code),
  boundary      geometry(Polygon, 4326) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_service_zones_province ON public.service_zones (province_code);

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  zone_id         INT REFERENCES public.service_zones(id),
  service_id      INT REFERENCES public.service_categories(id),
  day_type        VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (day_type IN ('all','weekday','weekend','holiday')),
  slot_type       VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (slot_type IN ('all','morning','afternoon','evening')),
  hourly_rate     NUMERIC(12,2) CHECK (hourly_rate IS NULL OR hourly_rate >= 0),
  surcharge_pct   NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (surcharge_pct >= 0),
  priority        SMALLINT NOT NULL DEFAULT 0,
  effective_from  TIMESTAMPTZ NOT NULL,
  effective_to    TIMESTAMPTZ,
  created_by      UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_zone    ON public.pricing_rules (zone_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_service ON public.pricing_rules (service_id);

CREATE TABLE IF NOT EXISTS public.checklist_templates (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id  INT NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  item_order  SMALLINT NOT NULL,
  task_name   VARCHAR(150) NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_service ON public.checklist_templates (service_id);

CREATE TABLE IF NOT EXISTS public.vouchers (
  id                  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code                VARCHAR(30) UNIQUE NOT NULL,
  discount_type       VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value      NUMERIC(12,2) NOT NULL CHECK (discount_value > 0),
  max_discount_amount NUMERIC(12,2),
  min_order_amount    NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  usage_limit         INT,
  per_user_limit      SMALLINT NOT NULL DEFAULT 1,
  valid_from          TIMESTAMPTZ NOT NULL,
  valid_to            TIMESTAMPTZ NOT NULL,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (valid_to > valid_from),
  CHECK (discount_type <> 'percent' OR discount_value <= 100)
);

-- ---------------------------------------------------------------------
-- 05. Đối tác & KYC
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_profiles (
  partner_id             UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  cccd_encrypted         BYTEA NOT NULL,                 -- pgp_sym_encrypt (AES-256)
  cccd_hash              VARCHAR(64) UNIQUE NOT NULL,    -- HMAC-SHA256 (có pepper) để tra cứu/chống trùng
  id_issue_date          DATE NOT NULL,
  criminal_record_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (criminal_record_status IN ('pending','clear','rejected')),
  health_cert_expiry     DATE,
  theoretical_score      NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  practical_score        NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  kyc_status             VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (kyc_status IN ('pending','needs_update','approved','rejected')),
  star_rating            NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (star_rating BETWEEN 1 AND 5),
  total_completed_jobs   INT NOT NULL DEFAULT 0,
  service_radius_km      NUMERIC(4,1) NOT NULL DEFAULT 5.0 CHECK (service_radius_km BETWEEN 2.0 AND 10.0),
  current_location       geography(Point, 4326),
  is_active              BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (NOT is_active OR kyc_status = 'approved')       -- chỉ KYC đã duyệt mới được nhận đơn
);

CREATE TABLE IF NOT EXISTS public.partner_services (
  partner_id         UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  service_id         INT NOT NULL REFERENCES public.service_categories(id),
  custom_hourly_rate NUMERIC(12,2),
  is_certified       BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (partner_id, service_id)
);
CREATE INDEX IF NOT EXISTS idx_partner_services_service ON public.partner_services (service_id);

CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id          UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  doc_type            VARCHAR(30) NOT NULL
                      CHECK (doc_type IN ('cccd_front','cccd_back','criminal_record','health_cert','skill_certificate')),
  file_url            TEXT NOT NULL,
  verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (verification_status IN ('pending','approved','rejected')),
  reviewer_notes      TEXT,
  reviewed_by         UUID REFERENCES public.users(id),
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_partner ON public.kyc_documents (partner_id);

CREATE TABLE IF NOT EXISTS public.partner_schedules (
  id          BIGSERIAL PRIMARY KEY,
  partner_id  UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0: Chủ nhật
  slot_type   VARCHAR(20) NOT NULL CHECK (slot_type IN ('morning','afternoon','evening')),
  status      VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('off','available','booked')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (partner_id, day_of_week, slot_type)
);

CREATE TABLE IF NOT EXISTS public.partner_schedule_exceptions (
  id              BIGSERIAL PRIMARY KEY,
  partner_id      UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  exception_date  DATE NOT NULL,
  slot_type       VARCHAR(20) CHECK (slot_type IN ('morning','afternoon','evening')),  -- NULL = cả ngày
  reason          VARCHAR(255),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_pse_once
  ON public.partner_schedule_exceptions (partner_id, exception_date, (COALESCE(slot_type, '')));

CREATE TABLE IF NOT EXISTS public.partner_locations (   -- append-only, retention 90 ngày
  id          BIGSERIAL PRIMARY KEY,
  partner_id  UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  location    geography(Point, 4326) NOT NULL,
  accuracy_m  NUMERIC(6,1),
  speed_kmh   NUMERIC(5,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_partner_locations_latest ON public.partner_locations (partner_id, recorded_at DESC);

-- ---------------------------------------------------------------------
-- 06. Đơn hàng & thanh toán (partition theo tháng)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID NOT NULL DEFAULT gen_random_uuid(),
  order_code            VARCHAR(20) NOT NULL
                        DEFAULT ('GDX-' || LPAD(nextval('public.order_code_seq')::TEXT, 6, '0')),
  customer_id           UUID NOT NULL REFERENCES public.users(id),
  partner_id            UUID REFERENCES public.partner_profiles(partner_id),
  service_id            INT NOT NULL REFERENCES public.service_categories(id),
  voucher_id            INT REFERENCES public.vouchers(id),
  pricing_rule_id       INT REFERENCES public.pricing_rules(id),
  status                VARCHAR(25) NOT NULL DEFAULT 'pending_payment'
                        CHECK (status IN ('pending_payment','payment_failed','waiting_partner',
                                          'partner_assigned','in_transit','in_progress',
                                          'completed','dispute','cancelled')),
  address_line          VARCHAR(255) NOT NULL,
  ward_code             VARCHAR(10) REFERENCES public.wards(code),
  location              geography(Point, 4326) NOT NULL,
  scheduled_date        DATE NOT NULL,
  scheduled_slot        VARCHAR(20) NOT NULL CHECK (scheduled_slot IN ('morning','afternoon','evening')),
  duration_hours        NUMERIC(3,1) NOT NULL CHECK (duration_hours > 0),
  base_amount           NUMERIC(12,2) NOT NULL CHECK (base_amount >= 0),
  addon_amount          NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (addon_amount >= 0),
  surcharge_amount      NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (surcharge_amount >= 0),
  discount_amount       NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
  final_amount          NUMERIC(12,2) NOT NULL
                        CHECK (final_amount = base_amount + addon_amount + surcharge_amount - discount_amount),
  partner_payout_rate   NUMERIC(3,2) NOT NULL DEFAULT 0.82 CHECK (partner_payout_rate BETWEEN 0 AND 1),
  partner_payout_amount NUMERIC(12,2) NOT NULL CHECK (partner_payout_amount >= 0),
  platform_fee_amount   NUMERIC(12,2) NOT NULL CHECK (platform_fee_amount >= 0),
  dispute_reason        TEXT,
  cancelled_by          UUID REFERENCES public.users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  UNIQUE (order_code, created_at),
  CHECK (partner_payout_amount + platform_fee_amount >= final_amount)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS public.order_addons (
  order_id          UUID NOT NULL,
  order_created_at  TIMESTAMPTZ NOT NULL,
  addon_id          INT NOT NULL REFERENCES public.service_addons(id),
  price_applied     NUMERIC(12,2) NOT NULL CHECK (price_applied >= 0),
  quantity          SMALLINT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id, order_created_at, addon_id),
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.order_voucher_usage (
  id               BIGSERIAL PRIMARY KEY,
  voucher_id       INT NOT NULL REFERENCES public.vouchers(id),
  order_id         UUID NOT NULL,
  order_created_at TIMESTAMPTZ NOT NULL,
  customer_id      UUID NOT NULL REFERENCES public.users(id),
  discount_applied NUMERIC(12,2) NOT NULL CHECK (discount_applied >= 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at),
  UNIQUE (order_id, order_created_at, voucher_id)
);
CREATE INDEX IF NOT EXISTS idx_order_voucher_usage_voucher  ON public.order_voucher_usage (voucher_id);
CREATE INDEX IF NOT EXISTS idx_order_voucher_usage_customer ON public.order_voucher_usage (customer_id);

CREATE TABLE IF NOT EXISTS public.order_status_history (   -- partition theo tháng, append-only
  id               BIGSERIAL,
  order_id         UUID NOT NULL,
  order_created_at TIMESTAMPTZ NOT NULL,
  from_status      VARCHAR(25),
  to_status        VARCHAR(25) NOT NULL,
  changed_by       UUID REFERENCES public.users(id),
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);
CREATE INDEX IF NOT EXISTS idx_osh_order      ON public.order_status_history (order_id, order_created_at);
CREATE INDEX IF NOT EXISTS idx_osh_changed_by ON public.order_status_history (changed_by);

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  method_type   VARCHAR(20) NOT NULL
                CHECK (method_type IN ('bank_card','momo','vnpay','zalopay','customer_wallet')),
  gateway_token VARCHAR(255),
  display_label VARCHAR(50),
  is_default    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods (user_id);

CREATE TABLE IF NOT EXISTS public.payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key   VARCHAR(64) UNIQUE NOT NULL,
  order_id          UUID NOT NULL,
  order_created_at  TIMESTAMPTZ NOT NULL,
  customer_id       UUID NOT NULL REFERENCES public.users(id),
  payment_method_id UUID REFERENCES public.payment_methods(id),
  amount            NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  gateway           VARCHAR(20) CHECK (gateway IN ('vnpay','momo','zalopay','customer_wallet')),
  external_ref      VARCHAR(100),
  status            VARCHAR(20) NOT NULL DEFAULT 'initiated'
                    CHECK (status IN ('initiated','pending','successful','failed','refunded')),
  failure_reason    VARCHAR(255),
  paid_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at)
);
CREATE INDEX IF NOT EXISTS idx_payments_order    ON public.payments (order_id, order_created_at);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status   ON public.payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_method   ON public.payments (payment_method_id);

CREATE TABLE IF NOT EXISTS public.customer_wallets (
  customer_id     UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  current_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (current_balance >= 0),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.customer_wallet_transactions (   -- append-only
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key  VARCHAR(64) UNIQUE NOT NULL,
  customer_id      UUID NOT NULL REFERENCES public.customer_wallets(customer_id),
  payment_id       UUID REFERENCES public.payments(id),
  transaction_type VARCHAR(25) NOT NULL
                   CHECK (transaction_type IN ('topup','order_payment','refund','adjustment')),
  amount           NUMERIC(12,2) NOT NULL,
  balance_before   NUMERIC(14,2) NOT NULL,
  balance_after    NUMERIC(14,2) NOT NULL,
  external_ref     VARCHAR(100),
  status           VARCHAR(20) NOT NULL DEFAULT 'successful'
                   CHECK (status IN ('pending','successful','failed')),
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (balance_after = balance_before + amount)
);
CREATE INDEX IF NOT EXISTS idx_cwt_customer ON public.customer_wallet_transactions (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cwt_payment  ON public.customer_wallet_transactions (payment_id);

-- ---------------------------------------------------------------------
-- 07. Ca làm việc
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shifts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID NOT NULL,
  order_created_at   TIMESTAMPTZ NOT NULL,
  partner_id         UUID NOT NULL REFERENCES public.partner_profiles(partner_id),
  check_in_time      TIMESTAMPTZ,
  check_out_time     TIMESTAMPTZ,
  check_in_location  geography(Point, 4326),
  check_out_location geography(Point, 4326),
  timer_status       VARCHAR(20) NOT NULL DEFAULT 'not_started'
                     CHECK (timer_status IN ('not_started','running','paused','completed','abandoned')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at),
  CHECK (check_out_time IS NULL OR check_in_time IS NULL OR check_out_time >= check_in_time)
);
CREATE INDEX IF NOT EXISTS idx_shifts_order   ON public.shifts (order_id, order_created_at);
CREATE INDEX IF NOT EXISTS idx_shifts_partner ON public.shifts (partner_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_shifts_one_active_per_order
  ON public.shifts (order_id, order_created_at) WHERE timer_status <> 'abandoned';

CREATE TABLE IF NOT EXISTS public.shift_checklists (
  id           BIGSERIAL PRIMARY KEY,
  shift_id     UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
  item_order   SMALLINT NOT NULL,
  task_name    VARCHAR(150) NOT NULL,
  is_required  BOOLEAN NOT NULL DEFAULT true,
  is_done      BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_shift_checklists_shift ON public.shift_checklists (shift_id);

CREATE TABLE IF NOT EXISTS public.shift_evidences (
  id          BIGSERIAL PRIMARY KEY,
  shift_id    UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
  stage       VARCHAR(10) NOT NULL CHECK (stage IN ('before','after')),
  photo_url   TEXT NOT NULL,
  caption     VARCHAR(255),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_shift_evidences_shift ON public.shift_evidences (shift_id);

-- ---------------------------------------------------------------------
-- 08. Ví đối tác & sổ cái kép
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_wallets (
  partner_id      UUID PRIMARY KEY REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  current_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (current_balance >= 0),
  pending_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
  total_withdrawn NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (total_withdrawn >= 0),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.partner_bank_accounts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id           UUID NOT NULL REFERENCES public.partner_profiles(partner_id) ON DELETE CASCADE,
  bank_name            VARCHAR(100) NOT NULL,
  account_number       VARCHAR(30) NOT NULL,
  account_holder_name  VARCHAR(100) NOT NULL,
  is_verified          BOOLEAN NOT NULL DEFAULT false,
  is_default           BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (partner_id, account_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_partner_bank_default
  ON public.partner_bank_accounts (partner_id) WHERE is_default;

CREATE TABLE IF NOT EXISTS public.payout_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key  VARCHAR(64) UNIQUE NOT NULL,
  partner_id       UUID NOT NULL REFERENCES public.partner_wallets(partner_id),
  bank_account_id  UUID NOT NULL REFERENCES public.partner_bank_accounts(id),
  amount           NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected','transferred')),
  external_ref     VARCHAR(100),
  reject_reason    VARCHAR(255),
  approved_by      UUID REFERENCES public.users(id),
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payout_requests_partner ON public.payout_requests (partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status  ON public.payout_requests (status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_bank    ON public.payout_requests (bank_account_id);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (   -- partition theo tháng, append-only
  id                UUID NOT NULL DEFAULT gen_random_uuid(),
  idempotency_key   VARCHAR(64) NOT NULL,
  partner_id        UUID NOT NULL REFERENCES public.partner_wallets(partner_id),
  order_id          UUID,
  order_created_at  TIMESTAMPTZ,
  payout_request_id UUID REFERENCES public.payout_requests(id),
  transaction_type  VARCHAR(25) NOT NULL
                    CHECK (transaction_type IN ('job_earning','tip_income','withdrawal_lock',
                                                'withdrawal_release','withdrawal_completed',
                                                'penalty_deduction','adjustment')),
  amount            NUMERIC(12,2) NOT NULL,
  balance_before    NUMERIC(14,2) NOT NULL,
  balance_after     NUMERIC(14,2) NOT NULL,
  external_ref      VARCHAR(100),
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','successful','failed')),
  description       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at) ON DELETE RESTRICT
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS public.wallet_tx_keys (
  idempotency_key VARCHAR(64) PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.platform_ledger (   -- append-only, bút toán kép
  id             BIGSERIAL PRIMARY KEY,
  entry_group_id UUID NOT NULL,
  account_code   VARCHAR(40) NOT NULL
                 CHECK (account_code IN ('CASH_GATEWAY','CUSTOMER_WALLET','PARTNER_PAYABLE',
                                         'PLATFORM_REVENUE','VOUCHER_EXPENSE','REFUND_PAYABLE')),
  order_id       UUID,
  debit_amount   NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (debit_amount >= 0),
  credit_amount  NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (credit_amount >= 0),
  description    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((debit_amount > 0) <> (credit_amount > 0))
);
CREATE INDEX IF NOT EXISTS idx_platform_ledger_group   ON public.platform_ledger (entry_group_id);
CREATE INDEX IF NOT EXISTS idx_platform_ledger_account ON public.platform_ledger (account_code, created_at);
CREATE INDEX IF NOT EXISTS idx_platform_ledger_order   ON public.platform_ledger (order_id);

-- ---------------------------------------------------------------------
-- 09. Đánh giá, tranh chấp & hệ thống
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL,
  order_created_at TIMESTAMPTZ NOT NULL,
  customer_id      UUID NOT NULL REFERENCES public.users(id),
  partner_id       UUID NOT NULL REFERENCES public.partner_profiles(partner_id),
  star_rating      SMALLINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  tip_amount       NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tip_amount >= 0),
  feedback_tags    JSONB NOT NULL DEFAULT '[]'::jsonb,
  comments         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at),
  UNIQUE (order_id, order_created_at)
);
CREATE INDEX IF NOT EXISTS idx_order_reviews_partner ON public.order_reviews (partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_reviews_customer ON public.order_reviews (customer_id);

CREATE TABLE IF NOT EXISTS public.partner_reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL,
  order_created_at TIMESTAMPTZ NOT NULL,
  partner_id       UUID NOT NULL REFERENCES public.partner_profiles(partner_id),
  customer_id      UUID NOT NULL REFERENCES public.users(id),
  star_rating      SMALLINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  feedback_tags    JSONB NOT NULL DEFAULT '[]'::jsonb,
  comments         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at),
  UNIQUE (order_id, order_created_at)
);
CREATE INDEX IF NOT EXISTS idx_partner_reviews_customer ON public.partner_reviews (customer_id);
CREATE INDEX IF NOT EXISTS idx_partner_reviews_partner  ON public.partner_reviews (partner_id);

CREATE TABLE IF NOT EXISTS public.disputes (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id               UUID NOT NULL,
  order_created_at       TIMESTAMPTZ NOT NULL,
  opened_by              UUID NOT NULL REFERENCES public.users(id),
  reason                 TEXT NOT NULL,
  status                 VARCHAR(20) NOT NULL DEFAULT 'open'
                         CHECK (status IN ('open','under_review','resolved','rejected')),
  resolution             TEXT,
  refund_amount          NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (refund_amount >= 0),
  partner_penalty_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (partner_penalty_amount >= 0),
  resolved_by            UUID REFERENCES public.users(id),
  resolved_at            TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id, order_created_at) REFERENCES public.orders (id, created_at)
);
CREATE INDEX IF NOT EXISTS idx_disputes_order     ON public.disputes (order_id, order_created_at);
CREATE INDEX IF NOT EXISTS idx_disputes_status    ON public.disputes (status);
CREATE INDEX IF NOT EXISTS idx_disputes_opened_by ON public.disputes (opened_by);

CREATE TABLE IF NOT EXISTS public.dispute_evidences (
  id          BIGSERIAL PRIMARY KEY,
  dispute_id  UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  file_url    TEXT NOT NULL,
  note        VARCHAR(255),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_dispute_evidences_dispute ON public.dispute_evidences (dispute_id);

CREATE TABLE IF NOT EXISTS public.notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type       VARCHAR(30) NOT NULL,
  title      VARCHAR(150) NOT NULL,
  body       TEXT NOT NULL,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user   ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications (user_id) WHERE NOT is_read;

CREATE TABLE IF NOT EXISTS public.audit_logs (   -- append-only
  id          BIGSERIAL PRIMARY KEY,
  actor_id    UUID NOT NULL REFERENCES public.users(id),
  action      VARCHAR(50) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id   VARCHAR(64) NOT NULL,
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor  ON public.audit_logs (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------
-- 10. Partition theo tháng (biên theo giờ Việt Nam, UTC+7) + partition DEFAULT
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders_default               PARTITION OF public.orders               DEFAULT;
CREATE TABLE IF NOT EXISTS public.order_status_history_default PARTITION OF public.order_status_history DEFAULT;
CREATE TABLE IF NOT EXISTS public.wallet_transactions_default  PARTITION OF public.wallet_transactions  DEFAULT;

CREATE OR REPLACE FUNCTION public.ensure_monthly_partitions(
  p_months_ahead INT DEFAULT 3, p_months_behind INT DEFAULT 2
) RETURNS INT LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
DECLARE
  v_table TEXT; v_m DATE; v_n DATE; v_i INT; v_cnt INT := 0; v_child TEXT;
  v_today DATE := (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
BEGIN
  FOREACH v_table IN ARRAY ARRAY['orders','order_status_history','wallet_transactions'] LOOP
    FOR v_i IN -p_months_behind..p_months_ahead LOOP
      v_m := (date_trunc('month', v_today) + make_interval(months => v_i))::DATE;
      v_n := (v_m + INTERVAL '1 month')::DATE;
      v_child := v_table || '_' || to_char(v_m, 'YYYY_MM');
      IF to_regclass('public.' || v_child) IS NULL THEN
        EXECUTE format(
          'CREATE TABLE public.%I PARTITION OF public.%I FOR VALUES FROM (%L) TO (%L)',
          v_child, v_table,
          to_char(v_m, 'YYYY-MM-DD') || ' 00:00:00+07', to_char(v_n, 'YYYY-MM-DD') || ' 00:00:00+07');
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_child);
        v_cnt := v_cnt + 1;
      END IF;
    END LOOP;
  END LOOP;
  RETURN v_cnt;
END $$;

SELECT public.ensure_monthly_partitions(3, 2);

-- ---------------------------------------------------------------------
-- 11. Chiến lược index
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_addresses_location_gist  ON public.user_addresses   USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_partner_current_location_gist ON public.partner_profiles  USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_partner_locations_gist        ON public.partner_locations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_service_zones_boundary_gist   ON public.service_zones    USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_orders_location_gist          ON public.orders           USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_orders_waiting_location_gist
  ON public.orders USING GIST (location) WHERE status = 'waiting_partner';
CREATE INDEX IF NOT EXISTS idx_orders_status_scheduled_date ON public.orders (status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_orders_partner_status        ON public.orders (partner_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created      ON public.orders (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_service               ON public.orders (service_id);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_user_addresses_default  ON public.user_addresses (user_id)  WHERE is_default;
CREATE UNIQUE INDEX IF NOT EXISTS uidx_payment_methods_default ON public.payment_methods (user_id) WHERE is_default;
CREATE INDEX IF NOT EXISTS idx_wallet_tx_partner_created ON public.wallet_transactions (partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_order           ON public.wallet_transactions (order_id, order_created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_payout          ON public.wallet_transactions (payout_request_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_idem            ON public.wallet_transactions (idempotency_key);

-- ---------------------------------------------------------------------
-- 12. Hàm tiện ích bảo mật & Nghiệp vụ
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.app_jwt_role()
RETURNS TEXT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$
  SELECT NULLIF(NULLIF(current_setting('request.jwt.claims', TRUE), '')::jsonb ->> 'role', '')
$$;

CREATE OR REPLACE FUNCTION public.app_current_user_id()
RETURNS UUID LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$
  SELECT COALESCE(
    NULLIF(NULLIF(current_setting('request.jwt.claims', TRUE), '')::jsonb ->> 'app_user_id', ''),
    NULLIF(current_setting('app.current_user_id', TRUE), '')
  )::UUID
$$;

CREATE OR REPLACE FUNCTION public.is_client_call()
RETURNS BOOLEAN LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$
  SELECT COALESCE(public.app_jwt_role(), '') IN ('anon', 'authenticated')
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (SELECT 1 FROM public.users u
                 WHERE u.id = public.app_current_user_id() AND u.role = 'admin' AND u.status = 'active')
$$;

CREATE OR REPLACE FUNCTION public.assert_self(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql STABLE SET search_path = public, pg_temp AS $$
BEGIN
  IF public.is_client_call()
     AND (p_user_id IS NULL OR p_user_id IS DISTINCT FROM public.app_current_user_id()) THEN
    RAISE EXCEPTION 'Không có quyền thao tác thay người dùng khác' USING ERRCODE = '42501';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.assert_admin(p_admin_id UUID)
RETURNS VOID LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u
                 WHERE u.id = p_admin_id AND u.role = 'admin' AND u.status = 'active') THEN
    RAISE EXCEPTION 'p_admin_id % không phải admin đang hoạt động', p_admin_id USING ERRCODE = '42501';
  END IF;
END $$;

-- 12.1 Mã hóa CCCD
CREATE OR REPLACE FUNCTION public.encrypt_cccd(p_cccd TEXT, p_key TEXT)
RETURNS BYTEA LANGUAGE sql VOLATILE SET search_path = public, extensions, pg_temp AS $$
  SELECT pgp_sym_encrypt(p_cccd, p_key, 'cipher-algo=aes256')
$$;

CREATE OR REPLACE FUNCTION public.decrypt_cccd(p_data BYTEA, p_key TEXT)
RETURNS TEXT LANGUAGE sql VOLATILE SET search_path = public, extensions, pg_temp AS $$
  SELECT pgp_sym_decrypt(p_data, p_key)
$$;

CREATE OR REPLACE FUNCTION public.hash_cccd(p_cccd TEXT, p_pepper TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE SET search_path = public, extensions, pg_temp AS $$
  SELECT encode(hmac(p_cccd, p_pepper, 'sha256'), 'hex')
$$;

-- 12.2 Ví KHÁCH
CREATE OR REPLACE FUNCTION public.apply_customer_wallet_transaction(
  p_customer_id UUID, p_transaction_type TEXT, p_amount NUMERIC, p_idempotency_key TEXT,
  p_payment_id UUID DEFAULT NULL, p_external_ref TEXT DEFAULT NULL, p_description TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_tx UUID; v_owner UUID; v_wallet public.customer_wallets%ROWTYPE; v_after NUMERIC(14,2);
BEGIN
  IF p_amount IS NULL OR p_amount = 0 THEN RAISE EXCEPTION 'Số tiền phải khác 0'; END IF;
  IF (p_transaction_type IN ('topup','refund') AND p_amount < 0)
     OR (p_transaction_type = 'order_payment' AND p_amount > 0) THEN
    RAISE EXCEPTION 'Dấu số tiền không hợp lệ cho loại giao dịch %', p_transaction_type;
  END IF;

  SELECT id, customer_id INTO v_tx, v_owner FROM public.customer_wallet_transactions
  WHERE idempotency_key = p_idempotency_key;
  IF v_tx IS NOT NULL THEN
    IF v_owner <> p_customer_id THEN RAISE EXCEPTION 'idempotency_key thuộc giao dịch khác'; END IF;
    RETURN v_tx;
  END IF;

  INSERT INTO public.customer_wallets (customer_id) VALUES (p_customer_id) ON CONFLICT DO NOTHING;
  SELECT * INTO v_wallet FROM public.customer_wallets WHERE customer_id = p_customer_id FOR UPDATE;

  SELECT id INTO v_tx FROM public.customer_wallet_transactions WHERE idempotency_key = p_idempotency_key;
  IF v_tx IS NOT NULL THEN RETURN v_tx; END IF;

  v_after := v_wallet.current_balance + p_amount;
  IF v_after < 0 THEN
    RAISE EXCEPTION 'Ví khách không đủ: before=%, amount=%', v_wallet.current_balance, p_amount;
  END IF;

  UPDATE public.customer_wallets SET current_balance = v_after, updated_at = CURRENT_TIMESTAMP
  WHERE customer_id = p_customer_id;

  INSERT INTO public.customer_wallet_transactions
    (idempotency_key, customer_id, payment_id, transaction_type, amount,
     balance_before, balance_after, external_ref, description)
  VALUES (p_idempotency_key, p_customer_id, p_payment_id, p_transaction_type, p_amount,
          v_wallet.current_balance, v_after, p_external_ref, p_description)
  RETURNING id INTO v_tx;
  RETURN v_tx;
END $$;

-- 12.3 Ví THỢ
CREATE OR REPLACE FUNCTION public.apply_wallet_transaction(
  p_partner_id UUID, p_transaction_type TEXT, p_amount NUMERIC, p_idempotency_key TEXT,
  p_order_id UUID DEFAULT NULL, p_order_created_at TIMESTAMPTZ DEFAULT NULL,
  p_payout_request_id UUID DEFAULT NULL, p_external_ref TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_tx UUID; v_owner UUID; v_wallet public.partner_wallets%ROWTYPE; v_after NUMERIC(14,2);
BEGIN
  IF p_amount IS NULL OR p_amount = 0 THEN RAISE EXCEPTION 'Số tiền phải khác 0'; END IF;
  IF (p_transaction_type IN ('job_earning','tip_income','withdrawal_release') AND p_amount < 0)
     OR (p_transaction_type IN ('penalty_deduction','withdrawal_lock','withdrawal_completed') AND p_amount > 0) THEN
    RAISE EXCEPTION 'Dấu số tiền không hợp lệ cho loại giao dịch %', p_transaction_type;
  END IF;

  SELECT id, partner_id INTO v_tx, v_owner FROM public.wallet_transactions
  WHERE idempotency_key = p_idempotency_key LIMIT 1;
  IF v_tx IS NOT NULL THEN
    IF v_owner <> p_partner_id THEN RAISE EXCEPTION 'idempotency_key thuộc giao dịch khác'; END IF;
    RETURN v_tx;
  END IF;

  INSERT INTO public.partner_wallets (partner_id) VALUES (p_partner_id) ON CONFLICT DO NOTHING;
  SELECT * INTO v_wallet FROM public.partner_wallets WHERE partner_id = p_partner_id FOR UPDATE;

  SELECT id INTO v_tx FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key LIMIT 1;
  IF v_tx IS NOT NULL THEN RETURN v_tx; END IF;

  v_after := v_wallet.current_balance + p_amount;
  IF v_after < 0 THEN
    RAISE EXCEPTION 'Số dư ví thợ % không đủ: before=%, amount=%', p_partner_id, v_wallet.current_balance, p_amount;
  END IF;

  UPDATE public.partner_wallets SET current_balance = v_after, updated_at = CURRENT_TIMESTAMP
  WHERE partner_id = p_partner_id;

  INSERT INTO public.wallet_transactions
    (idempotency_key, partner_id, order_id, order_created_at, payout_request_id,
     transaction_type, amount, balance_before, balance_after, external_ref, status, description)
  VALUES (p_idempotency_key, p_partner_id, p_order_id, p_order_created_at, p_payout_request_id,
          p_transaction_type, p_amount, v_wallet.current_balance, v_after, p_external_ref,
          'successful', p_description)
  RETURNING id INTO v_tx;
  RETURN v_tx;
END $$;

-- 12.4 Bút toán kép
CREATE OR REPLACE FUNCTION public.post_double_entries(
  p_entries JSONB, p_entry_group_id UUID DEFAULT gen_random_uuid(), p_description TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_debit NUMERIC := 0; v_credit NUMERIC := 0; v_lines INT := 0; r RECORD;
BEGIN
  IF jsonb_typeof(p_entries) <> 'array' THEN RAISE EXCEPTION 'p_entries phải là mảng JSON'; END IF;

  FOR r IN SELECT * FROM jsonb_to_recordset(p_entries)
           AS x(account_code TEXT, debit NUMERIC, credit NUMERIC, order_id UUID, description TEXT)
  LOOP
    IF COALESCE(r.debit, 0) = 0 AND COALESCE(r.credit, 0) = 0 THEN CONTINUE; END IF;
    v_debit := v_debit + COALESCE(r.debit, 0);
    v_credit := v_credit + COALESCE(r.credit, 0);
    v_lines := v_lines + 1;
  END LOOP;
  IF v_lines < 2 THEN RAISE EXCEPTION 'Bút toán cần >= 2 dòng Nợ/Có có số tiền'; END IF;
  IF v_debit <> v_credit THEN RAISE EXCEPTION 'Bút toán không cân bằng: Nợ=%, Có=%', v_debit, v_credit; END IF;

  FOR r IN SELECT * FROM jsonb_to_recordset(p_entries)
           AS x(account_code TEXT, debit NUMERIC, credit NUMERIC, order_id UUID, description TEXT)
  LOOP
    IF COALESCE(r.debit, 0) = 0 AND COALESCE(r.credit, 0) = 0 THEN CONTINUE; END IF;
    INSERT INTO public.platform_ledger
      (entry_group_id, account_code, order_id, debit_amount, credit_amount, description)
    VALUES (p_entry_group_id, r.account_code, r.order_id,
            COALESCE(r.debit, 0), COALESCE(r.credit, 0), COALESCE(r.description, p_description));
  END LOOP;
  RETURN p_entry_group_id;
END $$;

-- 12.5 Quyết toán đơn hoàn thành
CREATE OR REPLACE FUNCTION public.process_job_payout(p_order_id UUID, p_order_created_at TIMESTAMPTZ)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_order public.orders%ROWTYPE; v_subsidy NUMERIC(12,2);
BEGIN
  IF EXISTS (SELECT 1 FROM public.wallet_transactions
             WHERE idempotency_key = 'job-earning-' || p_order_id::TEXT) THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_order FROM public.orders
  WHERE id = p_order_id AND created_at = p_order_created_at FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy đơn'; END IF;
  IF v_order.status <> 'completed' THEN RAISE EXCEPTION 'Đơn chưa hoàn thành'; END IF;
  IF v_order.partner_id IS NULL THEN RAISE EXCEPTION 'Đơn chưa gán thợ'; END IF;

  v_subsidy := v_order.partner_payout_amount + v_order.platform_fee_amount - v_order.final_amount;
  IF v_subsidy < 0 THEN RAISE EXCEPTION 'Đơn %: thợ + phí < số khách trả', v_order.order_code; END IF;

  PERFORM public.apply_wallet_transaction(
    v_order.partner_id, 'job_earning', v_order.partner_payout_amount,
    'job-earning-' || v_order.id::TEXT, v_order.id, v_order.created_at, NULL, NULL,
    'Thu nhập đơn ' || v_order.order_code);

  RETURN public.post_double_entries(jsonb_build_array(
    jsonb_build_object('account_code','CASH_GATEWAY',    'debit',  v_order.final_amount,          'order_id', v_order.id),
    jsonb_build_object('account_code','VOUCHER_EXPENSE', 'debit',  v_subsidy,                     'order_id', v_order.id),
    jsonb_build_object('account_code','PARTNER_PAYABLE', 'credit', v_order.partner_payout_amount, 'order_id', v_order.id),
    jsonb_build_object('account_code','PLATFORM_REVENUE','credit', v_order.platform_fee_amount,   'order_id', v_order.id)
  ), gen_random_uuid(), 'Quyết toán đơn ' || v_order.order_code);
END $$;

-- 12.6 Rút tiền
CREATE OR REPLACE FUNCTION public.create_payout_request(
  p_partner_id UUID, p_bank_account_id UUID, p_amount NUMERIC, p_idempotency_key TEXT
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_request UUID; v_existing UUID; v_existing_partner UUID;
  v_wallet public.partner_wallets%ROWTYPE; v_bank public.partner_bank_accounts%ROWTYPE;
BEGIN
  PERFORM public.assert_self(p_partner_id);

  SELECT id, partner_id INTO v_existing, v_existing_partner FROM public.payout_requests
  WHERE idempotency_key = p_idempotency_key;
  IF v_existing IS NOT NULL THEN
    IF v_existing_partner <> p_partner_id THEN RAISE EXCEPTION 'idempotency_key thuộc lệnh khác'; END IF;
    RETURN v_existing;
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Số tiền rút phải > 0'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.partner_profiles WHERE partner_id = p_partner_id AND is_active) THEN
    RAISE EXCEPTION 'Đối tác không hoạt động';
  END IF;

  SELECT * INTO v_bank FROM public.partner_bank_accounts
  WHERE id = p_bank_account_id AND partner_id = p_partner_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Tài khoản ngân hàng không thuộc đối tác'; END IF;
  IF NOT v_bank.is_verified THEN RAISE EXCEPTION 'Tài khoản chưa xác minh'; END IF;

  SELECT * INTO v_wallet FROM public.partner_wallets WHERE partner_id = p_partner_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy ví'; END IF;

  SELECT id INTO v_existing FROM public.payout_requests WHERE idempotency_key = p_idempotency_key;
  IF v_existing IS NOT NULL THEN RETURN v_existing; END IF;

  IF v_wallet.current_balance < p_amount THEN
    RAISE EXCEPTION 'Số dư không đủ: % < %', v_wallet.current_balance, p_amount;
  END IF;

  UPDATE public.partner_wallets
  SET current_balance = current_balance - p_amount,
      pending_balance = pending_balance + p_amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE partner_id = p_partner_id;

  INSERT INTO public.payout_requests (idempotency_key, partner_id, bank_account_id, amount)
  VALUES (p_idempotency_key, p_partner_id, p_bank_account_id, p_amount)
  RETURNING id INTO v_request;

  INSERT INTO public.wallet_transactions
    (idempotency_key, partner_id, payout_request_id, transaction_type, amount,
     balance_before, balance_after, status, description)
  VALUES ('lock-' || v_request::TEXT, p_partner_id, v_request, 'withdrawal_lock', -p_amount,
          v_wallet.current_balance, v_wallet.current_balance - p_amount,
          'successful', 'Khóa tiền lệnh rút ' || v_request);
  RETURN v_request;
END $$;

CREATE OR REPLACE FUNCTION public.approve_payout_request(p_payout_request_id UUID, p_admin_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_req public.payout_requests%ROWTYPE;
BEGIN
  PERFORM public.assert_admin(p_admin_id);
  SELECT * INTO v_req FROM public.payout_requests WHERE id = p_payout_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy lệnh rút'; END IF;
  IF v_req.status <> 'pending' THEN RAISE EXCEPTION 'Chỉ duyệt lệnh pending'; END IF;

  UPDATE public.payout_requests
  SET status = 'approved', approved_by = p_admin_id, updated_at = CURRENT_TIMESTAMP
  WHERE id = p_payout_request_id;

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value)
  VALUES (p_admin_id, 'payout_approve', 'payout_requests', p_payout_request_id::TEXT,
          jsonb_build_object('status', v_req.status), jsonb_build_object('status', 'approved'));
END $$;

CREATE OR REPLACE FUNCTION public.complete_payout_request(
  p_payout_request_id UUID, p_admin_id UUID, p_external_ref TEXT DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_req public.payout_requests%ROWTYPE; v_wallet public.partner_wallets%ROWTYPE;
BEGIN
  PERFORM public.assert_admin(p_admin_id);
  SELECT * INTO v_req FROM public.payout_requests WHERE id = p_payout_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy lệnh rút'; END IF;
  IF v_req.status NOT IN ('pending','approved') THEN
    RAISE EXCEPTION 'Không thể chuyển khoản lệnh ở trạng thái %', v_req.status;
  END IF;
  SELECT * INTO v_wallet FROM public.partner_wallets WHERE partner_id = v_req.partner_id FOR UPDATE;

  UPDATE public.partner_wallets
  SET pending_balance = pending_balance - v_req.amount,
      total_withdrawn = total_withdrawn + v_req.amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE partner_id = v_req.partner_id;

  UPDATE public.payout_requests
  SET status = 'transferred', external_ref = COALESCE(p_external_ref, external_ref),
      approved_by = COALESCE(approved_by, p_admin_id),
      processed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
  WHERE id = p_payout_request_id;

  INSERT INTO public.wallet_transactions
    (idempotency_key, partner_id, payout_request_id, transaction_type, amount,
     balance_before, balance_after, external_ref, status, description)
  VALUES ('payout-done-' || p_payout_request_id::TEXT, v_req.partner_id, p_payout_request_id,
          'withdrawal_completed', -v_req.amount, v_wallet.current_balance, v_wallet.current_balance,
          p_external_ref, 'successful', 'Đã chuyển khoản lệnh rút ' || p_payout_request_id);

  PERFORM public.post_double_entries(jsonb_build_array(
    jsonb_build_object('account_code','PARTNER_PAYABLE','debit',  v_req.amount),
    jsonb_build_object('account_code','CASH_GATEWAY',   'credit', v_req.amount)
  ), gen_random_uuid(), 'Chi trả lệnh rút ' || p_payout_request_id);

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, new_value)
  VALUES (p_admin_id, 'payout_transfer', 'payout_requests', p_payout_request_id::TEXT,
          jsonb_build_object('status','transferred','amount', v_req.amount));
END $$;

CREATE OR REPLACE FUNCTION public.reject_payout_request(
  p_payout_request_id UUID, p_admin_id UUID, p_reason TEXT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_req public.payout_requests%ROWTYPE; v_wallet public.partner_wallets%ROWTYPE;
BEGIN
  PERFORM public.assert_admin(p_admin_id);
  SELECT * INTO v_req FROM public.payout_requests WHERE id = p_payout_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy lệnh rút'; END IF;
  IF v_req.status NOT IN ('pending','approved') THEN
    RAISE EXCEPTION 'Không thể từ chối lệnh ở trạng thái %', v_req.status;
  END IF;
  SELECT * INTO v_wallet FROM public.partner_wallets WHERE partner_id = v_req.partner_id FOR UPDATE;

  UPDATE public.partner_wallets
  SET pending_balance = pending_balance - v_req.amount,
      current_balance = current_balance + v_req.amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE partner_id = v_req.partner_id;

  UPDATE public.payout_requests
  SET status = 'rejected', reject_reason = p_reason, updated_at = CURRENT_TIMESTAMP
  WHERE id = p_payout_request_id;

  INSERT INTO public.wallet_transactions
    (idempotency_key, partner_id, payout_request_id, transaction_type, amount,
     balance_before, balance_after, status, description)
  VALUES ('payout-reject-' || p_payout_request_id::TEXT, v_req.partner_id, p_payout_request_id,
          'withdrawal_release', v_req.amount, v_wallet.current_balance,
          v_wallet.current_balance + v_req.amount, 'successful',
          'Giải phóng tiền lệnh rút bị từ chối ' || p_payout_request_id);

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, new_value)
  VALUES (p_admin_id, 'payout_reject', 'payout_requests', p_payout_request_id::TEXT,
          jsonb_build_object('status','rejected','reason', p_reason));
END $$;

-- 12.7 Flash Claim (khóa NOWAIT)
CREATE OR REPLACE FUNCTION public.flash_claim_order(
  p_order_id UUID, p_order_created_at TIMESTAMPTZ, p_partner_id UUID
) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE
  v_order public.orders%ROWTYPE; v_partner public.partner_profiles%ROWTYPE;
  v_dow SMALLINT; v_found BOOLEAN;
BEGIN
  PERFORM public.assert_self(p_partner_id);

  BEGIN
    SELECT * INTO v_order FROM public.orders
    WHERE id = p_order_id AND created_at = p_order_created_at
    FOR UPDATE NOWAIT;
    v_found := FOUND;
  EXCEPTION WHEN lock_not_available THEN
    RAISE EXCEPTION 'Đơn đang được thợ khác chốt, hãy thử lại';
  END;
  IF NOT v_found THEN RAISE EXCEPTION 'Không tìm thấy đơn'; END IF;
  IF v_order.status <> 'waiting_partner' THEN RETURN FALSE; END IF;

  SELECT * INTO v_partner FROM public.partner_profiles WHERE partner_id = p_partner_id;
  IF NOT FOUND OR v_partner.kyc_status <> 'approved' OR NOT v_partner.is_active THEN
    RAISE EXCEPTION 'Đối tác chưa đủ điều kiện nhận đơn';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.partner_services ps
                 WHERE ps.partner_id = p_partner_id AND ps.service_id = v_order.service_id) THEN
    RAISE EXCEPTION 'Đối tác không đăng ký dịch vụ này';
  END IF;
  IF v_partner.current_location IS NULL THEN
    RAISE EXCEPTION 'Chưa có vị trí GPS của đối tác';
  END IF;
  IF NOT ST_DWithin(v_order.location, v_partner.current_location, v_partner.service_radius_km * 1000) THEN
    RAISE EXCEPTION 'Đơn ngoài bán kính phục vụ';
  END IF;
  IF EXISTS (SELECT 1 FROM public.partner_schedule_exceptions ex
             WHERE ex.partner_id = p_partner_id AND ex.exception_date = v_order.scheduled_date
               AND (ex.slot_type IS NULL OR ex.slot_type = v_order.scheduled_slot)) THEN
    RAISE EXCEPTION 'Đối tác đã báo nghỉ ca này';
  END IF;

  v_dow := EXTRACT(DOW FROM v_order.scheduled_date)::SMALLINT;
  PERFORM 1 FROM public.partner_schedules s
  WHERE s.partner_id = p_partner_id AND s.day_of_week = v_dow
    AND s.slot_type = v_order.scheduled_slot AND s.status = 'available'
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Đối tác không rảnh ca này'; END IF;

  UPDATE public.orders SET status = 'partner_assigned', partner_id = p_partner_id
  WHERE id = p_order_id AND created_at = p_order_created_at;

  UPDATE public.partner_schedules SET status = 'booked'
  WHERE partner_id = p_partner_id AND day_of_week = v_dow AND slot_type = v_order.scheduled_slot;

  INSERT INTO public.notifications (user_id, type, title, body, data)
  VALUES (v_order.customer_id, 'order_update', 'Thợ đã nhận đơn',
          'Đơn ' || v_order.order_code || ' đã được thợ tiếp nhận.',
          jsonb_build_object('order_id', v_order.id));
  RETURN TRUE;
END $$;

-- 12.8 GPS
CREATE OR REPLACE FUNCTION public.record_partner_location(
  p_partner_id UUID, p_longitude DOUBLE PRECISION, p_latitude DOUBLE PRECISION,
  p_accuracy_m NUMERIC DEFAULT NULL, p_speed_kmh NUMERIC DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
BEGIN
  PERFORM public.assert_self(p_partner_id);
  IF p_longitude NOT BETWEEN -180 AND 180 OR p_latitude NOT BETWEEN -90 AND 90 THEN
    RAISE EXCEPTION 'Tọa độ không hợp lệ';
  END IF;
  INSERT INTO public.partner_locations (partner_id, location, accuracy_m, speed_kmh)
  VALUES (p_partner_id, ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
          p_accuracy_m, p_speed_kmh);
END $$;

-- 12.9 Radar
CREATE OR REPLACE FUNCTION public.find_waiting_orders_near(p_partner_id UUID)
RETURNS TABLE (
  order_id UUID, order_created_at TIMESTAMPTZ, order_code TEXT,
  service_id INT, service_name TEXT, scheduled_date DATE, scheduled_slot TEXT,
  duration_hours NUMERIC, final_amount NUMERIC, address_line TEXT, distance_m DOUBLE PRECISION
) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
#variable_conflict use_column
BEGIN
  PERFORM public.assert_self(p_partner_id);
  RETURN QUERY
  SELECT o.id, o.created_at, o.order_code::TEXT, o.service_id, sc.name::TEXT,
         o.scheduled_date, o.scheduled_slot::TEXT, o.duration_hours, o.final_amount,
         o.address_line::TEXT, ST_Distance(o.location, pp.current_location)::DOUBLE PRECISION
  FROM public.partner_profiles pp
  JOIN public.orders o
    ON o.status = 'waiting_partner'
   AND ST_DWithin(o.location, pp.current_location, pp.service_radius_km * 1000)
  JOIN public.service_categories sc ON sc.id = o.service_id
  WHERE pp.partner_id = p_partner_id
    AND pp.is_active AND pp.kyc_status = 'approved'
    AND pp.current_location IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.partner_services ps
                WHERE ps.partner_id = p_partner_id AND ps.service_id = o.service_id)
    AND EXISTS (SELECT 1 FROM public.partner_schedules s
                WHERE s.partner_id = p_partner_id AND s.status = 'available'
                  AND s.day_of_week = EXTRACT(DOW FROM o.scheduled_date)::SMALLINT
                  AND s.slot_type = o.scheduled_slot)
    AND NOT EXISTS (SELECT 1 FROM public.partner_schedule_exceptions ex
                    WHERE ex.partner_id = p_partner_id AND ex.exception_date = o.scheduled_date
                      AND (ex.slot_type IS NULL OR ex.slot_type = o.scheduled_slot))
  ORDER BY 11;
END $$;

-- 12.10 Kết ca
CREATE OR REPLACE FUNCTION public.check_out_shift(
  p_shift_id UUID, p_longitude DOUBLE PRECISION, p_latitude DOUBLE PRECISION
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_shift public.shifts%ROWTYPE; v_pending INT;
BEGIN
  SELECT * INTO v_shift FROM public.shifts WHERE id = p_shift_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy ca'; END IF;
  PERFORM public.assert_self(v_shift.partner_id);
  IF v_shift.timer_status NOT IN ('running','paused') THEN
    RAISE EXCEPTION 'Ca không đang diễn ra (timer_status=%)', v_shift.timer_status;
  END IF;
  IF p_longitude NOT BETWEEN -180 AND 180 OR p_latitude NOT BETWEEN -90 AND 90 THEN
    RAISE EXCEPTION 'Tọa độ không hợp lệ';
  END IF;
  SELECT COUNT(*) INTO v_pending FROM public.shift_checklists
  WHERE shift_id = p_shift_id AND is_required AND NOT is_done;
  IF v_pending > 0 THEN
    RAISE EXCEPTION 'Còn % mục checklist bắt buộc chưa hoàn thành', v_pending;
  END IF;
  UPDATE public.shifts
  SET check_out_time = CURRENT_TIMESTAMP,
      check_out_location = ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
      timer_status = 'completed'
  WHERE id = p_shift_id;
END $$;

-- 12.11 Hoàn thành đơn
CREATE OR REPLACE FUNCTION public.complete_order(
  p_order_id UUID, p_order_created_at TIMESTAMPTZ, p_changed_by UUID DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_order public.orders%ROWTYPE; v_by UUID;
BEGIN
  SELECT * INTO v_order FROM public.orders
  WHERE id = p_order_id AND created_at = p_order_created_at FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy đơn'; END IF;

  IF public.is_client_call()
     AND NOT (v_order.partner_id IS NOT DISTINCT FROM public.app_current_user_id() OR public.is_admin()) THEN
    RAISE EXCEPTION 'Chỉ thợ của đơn hoặc admin được hoàn thành đơn' USING ERRCODE = '42501';
  END IF;
  IF v_order.status <> 'in_progress' THEN
    RAISE EXCEPTION 'Chỉ hoàn thành đơn in_progress (hiện tại: %)', v_order.status;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.shifts s
                 WHERE s.order_id = v_order.id AND s.order_created_at = v_order.created_at
                   AND s.partner_id = v_order.partner_id AND s.timer_status = 'completed') THEN
    RAISE EXCEPTION 'Chưa kết ca (check-out) cho đơn này';
  END IF;

  v_by := CASE WHEN public.is_client_call() THEN public.app_current_user_id()
               ELSE COALESCE(p_changed_by, public.app_current_user_id()) END;
  IF v_by IS NOT NULL THEN PERFORM set_config('app.current_user_id', v_by::TEXT, TRUE); END IF;

  UPDATE public.orders SET status = 'completed'
  WHERE id = p_order_id AND created_at = p_order_created_at;
END $$;

-- ---------------------------------------------------------------------
-- 13. Trigger nghiệp vụ
-- ---------------------------------------------------------------------
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT c.relname AS tbl FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r','p') AND NOT c.relispartition
      AND EXISTS (SELECT 1 FROM pg_attribute a
                  WHERE a.attrelid = c.oid AND a.attname = 'updated_at' AND NOT a.attisdropped)
  LOOP
    EXECUTE format('CREATE OR REPLACE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I
                    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', r.tbl, r.tbl);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.assert_partner_role()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = NEW.partner_id AND u.role = 'partner') THEN
    RAISE EXCEPTION 'partner_id % phải là user role=partner', NEW.partner_id;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_partner_profiles_assert_role
BEFORE INSERT OR UPDATE OF partner_id ON public.partner_profiles
FOR EACH ROW EXECUTE FUNCTION public.assert_partner_role();

CREATE OR REPLACE FUNCTION public.create_partner_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.partner_wallets (partner_id) VALUES (NEW.partner_id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_partner_profiles_wallet
AFTER INSERT ON public.partner_profiles
FOR EACH ROW EXECUTE FUNCTION public.create_partner_wallet();

CREATE OR REPLACE FUNCTION public.create_customer_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO public.customer_wallets (customer_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_users_customer_wallet
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION public.create_customer_wallet();

CREATE OR REPLACE FUNCTION public.protect_booked_schedule()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'booked' THEN
      RAISE EXCEPTION 'Không thể xóa ca đã book (partner=%, day=%, slot=%)',
                       OLD.partner_id, OLD.day_of_week, OLD.slot_type;
    END IF;
    RETURN OLD;
  END IF;
  IF OLD.status = 'booked' THEN
    IF NEW.partner_id IS DISTINCT FROM OLD.partner_id
       OR NEW.day_of_week IS DISTINCT FROM OLD.day_of_week
       OR NEW.slot_type IS DISTINCT FROM OLD.slot_type THEN
      RAISE EXCEPTION 'Không thể sửa thuộc tính của ca đã book';
    END IF;
    IF NEW.status NOT IN ('booked','available') THEN
      RAISE EXCEPTION 'Ca đã book chỉ được giải phóng về available, không thể thành %', NEW.status;
    END IF;
    IF NEW.status = 'available' AND EXISTS (
         SELECT 1 FROM public.orders o
         WHERE o.partner_id = OLD.partner_id
           AND o.status IN ('partner_assigned','in_transit','in_progress')
           AND EXTRACT(DOW FROM o.scheduled_date)::SMALLINT = OLD.day_of_week
           AND o.scheduled_slot = OLD.slot_type) THEN
      RAISE EXCEPTION 'Còn đơn đang thực hiện trong ca này, chưa thể giải phóng';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_partner_schedules_protect
BEFORE UPDATE OR DELETE ON public.partner_schedules
FOR EACH ROW EXECUTE FUNCTION public.protect_booked_schedule();

CREATE OR REPLACE FUNCTION public.sync_partner_current_location()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
BEGIN
  UPDATE public.partner_profiles SET current_location = NEW.location
  WHERE partner_id = NEW.partner_id;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_partner_locations_sync_cache
AFTER INSERT ON public.partner_locations
FOR EACH ROW EXECUTE FUNCTION public.sync_partner_current_location();

CREATE OR REPLACE FUNCTION public.generate_shift_checklist()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_service_id INT;
BEGIN
  SELECT o.service_id INTO v_service_id FROM public.orders o
  WHERE o.id = NEW.order_id AND o.created_at = NEW.order_created_at;
  INSERT INTO public.shift_checklists (shift_id, item_order, task_name, is_required)
  SELECT NEW.id, t.item_order, t.task_name, t.is_required
  FROM public.checklist_templates t WHERE t.service_id = v_service_id AND t.is_active;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_shifts_gen_checklist
AFTER INSERT ON public.shifts
FOR EACH ROW EXECUTE FUNCTION public.generate_shift_checklist();

CREATE OR REPLACE FUNCTION public.orders_before_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_paid NUMERIC(14,2);
BEGIN
  IF NEW.id <> OLD.id OR NEW.created_at <> OLD.created_at
     OR NEW.order_code <> OLD.order_code OR NEW.customer_id <> OLD.customer_id THEN
    RAISE EXCEPTION 'Không được đổi id / created_at / order_code / customer_id của đơn';
  END IF;

  IF OLD.status <> 'pending_payment' AND
     ROW(NEW.base_amount, NEW.addon_amount, NEW.surcharge_amount, NEW.discount_amount, NEW.final_amount,
         NEW.partner_payout_rate, NEW.partner_payout_amount, NEW.platform_fee_amount,
         NEW.service_id, NEW.duration_hours, NEW.voucher_id, NEW.pricing_rule_id)
     IS DISTINCT FROM
     ROW(OLD.base_amount, OLD.addon_amount, OLD.surcharge_amount, OLD.discount_amount, OLD.final_amount,
         OLD.partner_payout_rate, OLD.partner_payout_amount, OLD.platform_fee_amount,
         OLD.service_id, OLD.duration_hours, OLD.voucher_id, OLD.pricing_rule_id) THEN
    RAISE EXCEPTION 'Đơn % đã qua bước thanh toán, không được sửa số tiền/cấu hình giá', OLD.order_code;
  END IF;

  IF NEW.status = OLD.status THEN
    IF NEW.partner_id IS DISTINCT FROM OLD.partner_id THEN
      RAISE EXCEPTION 'Chỉ được đổi thợ khi chuyển trạng thái (nhận đơn / thợ bỏ đơn)';
    END IF;
    RETURN NEW;
  END IF;

  IF NOT (OLD.status || '>' || NEW.status) = ANY (ARRAY[
      'pending_payment>payment_failed','pending_payment>waiting_partner','pending_payment>cancelled',
      'payment_failed>pending_payment','payment_failed>cancelled',
      'waiting_partner>partner_assigned','waiting_partner>cancelled',
      'partner_assigned>waiting_partner','partner_assigned>in_transit','partner_assigned>cancelled',
      'in_transit>in_progress','in_transit>cancelled',
      'in_progress>completed','in_progress>dispute','in_progress>cancelled',
      'completed>dispute','dispute>completed','dispute>cancelled']) THEN
    RAISE EXCEPTION 'Chuyển trạng thái đơn không hợp lệ: % -> %', OLD.status, NEW.status;
  END IF;

  IF OLD.status = 'pending_payment' AND NEW.status = 'waiting_partner' THEN
    SELECT COALESCE(SUM(p.amount), 0) INTO v_paid FROM public.payments p
    WHERE p.order_id = NEW.id AND p.order_created_at = NEW.created_at AND p.status = 'successful';
    IF v_paid < NEW.final_amount THEN
      RAISE EXCEPTION 'Đơn % chưa thanh toán đủ (đã thu % / cần %)', NEW.order_code, v_paid, NEW.final_amount;
    END IF;
  END IF;

  IF NEW.status = 'waiting_partner' THEN
    NEW.partner_id := NULL;
  ELSIF NEW.status IN ('partner_assigned','in_transit','in_progress','completed') AND NEW.partner_id IS NULL THEN
    RAISE EXCEPTION 'Trạng thái % yêu cầu đã gán thợ', NEW.status;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_orders_guard
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.orders_before_update();

CREATE OR REPLACE FUNCTION public.on_order_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_by UUID; v_release UUID;
BEGIN
  v_by := public.app_current_user_id();

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, order_created_at, from_status, to_status, changed_by)
    VALUES (NEW.id, NEW.created_at, NULL, NEW.status, v_by);
    RETURN NEW;
  END IF;

  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;

  INSERT INTO public.order_status_history (order_id, order_created_at, from_status, to_status, changed_by)
  VALUES (NEW.id, NEW.created_at, OLD.status, NEW.status, v_by);

  IF NEW.status = 'completed' THEN
    IF public.process_job_payout(NEW.id, NEW.created_at) IS NOT NULL THEN
      UPDATE public.partner_profiles SET total_completed_jobs = total_completed_jobs + 1
      WHERE partner_id = NEW.partner_id;
    END IF;
  END IF;

  v_release := CASE WHEN NEW.status IN ('completed','cancelled') THEN NEW.partner_id
                    WHEN NEW.status = 'waiting_partner'          THEN OLD.partner_id END;
  IF v_release IS NOT NULL THEN
    UPDATE public.partner_schedules SET status = 'available'
    WHERE partner_id = v_release AND status = 'booked'
      AND day_of_week = EXTRACT(DOW FROM NEW.scheduled_date)::SMALLINT
      AND slot_type = NEW.scheduled_slot;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_orders_status_change
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.on_order_status_change();

CREATE OR REPLACE FUNCTION public.prevent_mutation()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  RAISE EXCEPTION 'Bảng % không cho phép % (append-only / không xóa cứng)', TG_TABLE_NAME, TG_OP;
END $$;
CREATE OR REPLACE TRIGGER trg_orders_no_delete
BEFORE DELETE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();
CREATE OR REPLACE TRIGGER trg_ledger_append_only
BEFORE UPDATE OR DELETE ON public.platform_ledger FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();
CREATE OR REPLACE TRIGGER trg_wallet_tx_append_only
BEFORE UPDATE OR DELETE ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();
CREATE OR REPLACE TRIGGER trg_cwt_append_only
BEFORE UPDATE OR DELETE ON public.customer_wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();
CREATE OR REPLACE TRIGGER trg_osh_append_only
BEFORE UPDATE OR DELETE ON public.order_status_history FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();
CREATE OR REPLACE TRIGGER trg_audit_append_only
BEFORE UPDATE OR DELETE ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_mutation();

CREATE OR REPLACE FUNCTION public.assert_ledger_group_balanced()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
DECLARE v_d NUMERIC; v_c NUMERIC;
BEGIN
  SELECT COALESCE(SUM(debit_amount),0), COALESCE(SUM(credit_amount),0) INTO v_d, v_c
  FROM public.platform_ledger WHERE entry_group_id = NEW.entry_group_id;
  IF v_d <> v_c THEN
    RAISE EXCEPTION 'Sổ cái lệch: group % Nợ=% Có=%', NEW.entry_group_id, v_d, v_c;
  END IF;
  RETURN NULL;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ledger_balanced'
                 AND tgrelid = 'public.platform_ledger'::regclass) THEN
    CREATE CONSTRAINT TRIGGER trg_ledger_balanced
      AFTER INSERT ON public.platform_ledger DEFERRABLE INITIALLY DEFERRED
      FOR EACH ROW EXECUTE FUNCTION public.assert_ledger_group_balanced();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.enforce_wallet_tx_idempotency()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.wallet_tx_keys (idempotency_key) VALUES (NEW.idempotency_key);
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_wallet_tx_idempotency
BEFORE INSERT ON public.wallet_transactions
FOR EACH ROW EXECUTE FUNCTION public.enforce_wallet_tx_idempotency();

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_order public.orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id AND created_at = NEW.order_created_at;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không tìm thấy đơn'; END IF;
  IF v_order.status <> 'completed' THEN RAISE EXCEPTION 'Chỉ đánh giá đơn đã hoàn thành'; END IF;
  IF v_order.customer_id <> NEW.customer_id OR v_order.partner_id IS DISTINCT FROM NEW.partner_id THEN
    RAISE EXCEPTION 'Khách/thợ trong đánh giá không khớp với đơn';
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_order_reviews_validate
BEFORE INSERT ON public.order_reviews FOR EACH ROW EXECUTE FUNCTION public.validate_review();
CREATE OR REPLACE TRIGGER trg_partner_reviews_validate
BEFORE INSERT ON public.partner_reviews FOR EACH ROW EXECUTE FUNCTION public.validate_review();

CREATE OR REPLACE FUNCTION public.on_order_review_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, pg_temp AS $$
DECLARE v_code TEXT;
BEGIN
  UPDATE public.partner_profiles
  SET star_rating = COALESCE((SELECT ROUND(AVG(r.star_rating), 2) FROM public.order_reviews r
                              WHERE r.partner_id = NEW.partner_id), 5.00)
  WHERE partner_id = NEW.partner_id;

  IF NEW.tip_amount > 0 THEN
    SELECT o.order_code INTO v_code FROM public.orders o
    WHERE o.id = NEW.order_id AND o.created_at = NEW.order_created_at;

    PERFORM public.apply_wallet_transaction(
      NEW.partner_id, 'tip_income', NEW.tip_amount, 'tip-' || NEW.id::TEXT,
      NEW.order_id, NEW.order_created_at, NULL, NULL, 'Tiền tip đơn ' || v_code);

    PERFORM public.post_double_entries(jsonb_build_array(
      jsonb_build_object('account_code','CASH_GATEWAY',   'debit',  NEW.tip_amount, 'order_id', NEW.order_id),
      jsonb_build_object('account_code','PARTNER_PAYABLE','credit', NEW.tip_amount, 'order_id', NEW.order_id)
    ), gen_random_uuid(), 'Tip đơn ' || v_code);
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_order_review_side_effects
AFTER INSERT ON public.order_reviews
FOR EACH ROW EXECUTE FUNCTION public.on_order_review_insert();

CREATE OR REPLACE FUNCTION public.on_partner_review_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  UPDATE public.users
  SET customer_star_rating = COALESCE((SELECT ROUND(AVG(r.star_rating), 2) FROM public.partner_reviews r
                                       WHERE r.customer_id = NEW.customer_id), 5.00)
  WHERE id = NEW.customer_id;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER trg_partner_review_side_effects
AFTER INSERT ON public.partner_reviews
FOR EACH ROW EXECUTE FUNCTION public.on_partner_review_insert();

-- ---------------------------------------------------------------------
-- 14. View đối soát
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_ledger_unbalanced_groups WITH (security_invoker = true) AS
SELECT entry_group_id, SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit,
       SUM(debit_amount) - SUM(credit_amount) AS difference
FROM public.platform_ledger
GROUP BY entry_group_id
HAVING SUM(debit_amount) <> SUM(credit_amount);

CREATE OR REPLACE VIEW public.v_ledger_account_summary WITH (security_invoker = true) AS
SELECT account_code, SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
FROM public.platform_ledger
GROUP BY account_code;

-- ---------------------------------------------------------------------
-- 15. RLS + phân quyền
-- ---------------------------------------------------------------------
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT c.relname AS tbl FROM pg_class c
           JOIN pg_namespace n ON n.oid = c.relnamespace
           WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tbl);
  END LOOP;
END $$;

DROP POLICY IF EXISTS orders_insert     ON public.orders;
DROP POLICY IF EXISTS vouchers_select   ON public.vouchers;
DROP POLICY IF EXISTS users_self_update ON public.users;

CREATE OR REPLACE FUNCTION pg_temp.mkpol(p_name TEXT, p_table TEXT, p_def TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies
                 WHERE schemaname = 'public' AND tablename = p_table AND policyname = p_name) THEN
    EXECUTE format('CREATE POLICY %I ON public.%I %s', p_name, p_table, p_def);
  END IF;
END $$;

SELECT pg_temp.mkpol('provinces_select',          'provinces',          'FOR SELECT TO anon, authenticated USING (true)');
SELECT pg_temp.mkpol('wards_select',              'wards',              'FOR SELECT TO anon, authenticated USING (true)');
SELECT pg_temp.mkpol('service_categories_select', 'service_categories', 'FOR SELECT TO anon, authenticated USING (is_active)');
SELECT pg_temp.mkpol('service_addons_select',     'service_addons',     'FOR SELECT TO anon, authenticated USING (is_active)');
SELECT pg_temp.mkpol('service_zones_select',      'service_zones',      'FOR SELECT TO anon, authenticated USING (is_active)');

SELECT pg_temp.mkpol('users_self_select',   'users', 'FOR SELECT TO authenticated USING (id = public.app_current_user_id())');
SELECT pg_temp.mkpol('users_self_update',   'users', 'FOR UPDATE TO authenticated USING (id = public.app_current_user_id()) WITH CHECK (id = public.app_current_user_id())');
SELECT pg_temp.mkpol('user_addresses_owner','user_addresses', 'FOR ALL TO authenticated USING (user_id = public.app_current_user_id()) WITH CHECK (user_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('user_sessions_owner', 'user_sessions',   'FOR SELECT TO authenticated USING (user_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('payment_methods_owner','payment_methods','FOR ALL TO authenticated USING (user_id = public.app_current_user_id()) WITH CHECK (user_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('notifications_owner_sel','notifications','FOR SELECT TO authenticated USING (user_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('notifications_owner_upd','notifications','FOR UPDATE TO authenticated USING (user_id = public.app_current_user_id()) WITH CHECK (user_id = public.app_current_user_id())');

SELECT pg_temp.mkpol('orders_select', 'orders', 'FOR SELECT TO authenticated USING (customer_id = public.app_current_user_id() OR partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('order_addons_select', 'order_addons', 'FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.created_at = order_created_at))');
SELECT pg_temp.mkpol('order_status_history_select', 'order_status_history', 'FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.created_at = order_created_at))');
SELECT pg_temp.mkpol('order_reviews_select', 'order_reviews', 'FOR SELECT TO authenticated USING (customer_id = public.app_current_user_id() OR partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('payments_self', 'payments', 'FOR SELECT TO authenticated USING (customer_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('customer_wallets_self', 'customer_wallets', 'FOR SELECT TO authenticated USING (customer_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('cwt_self', 'customer_wallet_transactions', 'FOR SELECT TO authenticated USING (customer_id = public.app_current_user_id())');

SELECT pg_temp.mkpol('partner_profiles_self', 'partner_profiles', 'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('partner_services_self', 'partner_services', 'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('kyc_documents_self',    'kyc_documents',    'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('partner_wallets_self',  'partner_wallets',  'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('wallet_tx_self',        'wallet_transactions','FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('payout_requests_self',  'payout_requests',  'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('bank_accounts_self',    'partner_bank_accounts','FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('partner_schedules_owner','partner_schedules','FOR ALL TO authenticated USING (partner_id = public.app_current_user_id()) WITH CHECK (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('partner_schedule_exceptions_owner','partner_schedule_exceptions','FOR ALL TO authenticated USING (partner_id = public.app_current_user_id()) WITH CHECK (partner_id = public.app_current_user_id())');
SELECT pg_temp.mkpol('shifts_select', 'shifts', 'FOR SELECT TO authenticated USING (partner_id = public.app_current_user_id() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.created_at = order_created_at AND o.customer_id = public.app_current_user_id()))');
SELECT pg_temp.mkpol('shift_checklists_select', 'shift_checklists', 'FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.shifts s WHERE s.id = shift_id))');
SELECT pg_temp.mkpol('shift_checklists_update', 'shift_checklists', 'FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.shifts s WHERE s.id = shift_id AND s.partner_id = public.app_current_user_id())) WITH CHECK (EXISTS (SELECT 1 FROM public.shifts s WHERE s.id = shift_id AND s.partner_id = public.app_current_user_id()))');

REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

GRANT SELECT ON public.provinces, public.wards, public.service_categories,
                public.service_addons, public.service_zones TO anon, authenticated;

GRANT SELECT (id, full_name, phone, email, role, avatar_url, customer_star_rating, status, created_at, updated_at)
  ON public.users TO authenticated;
GRANT UPDATE (full_name, email, avatar_url) ON public.users TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_addresses, public.payment_methods,
      public.partner_schedules, public.partner_schedule_exceptions TO authenticated;
GRANT SELECT (id, user_id, device_info, ip_address, expires_at, revoked_at, created_at)
  ON public.user_sessions TO authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT UPDATE (is_read) ON public.notifications TO authenticated;

GRANT SELECT ON public.orders, public.order_addons, public.order_status_history, public.order_reviews,
                public.payments, public.customer_wallets, public.customer_wallet_transactions,
                public.partner_services, public.kyc_documents, public.partner_wallets,
                public.wallet_transactions, public.payout_requests, public.partner_bank_accounts,
                public.shifts, public.shift_checklists TO authenticated;
GRANT UPDATE (is_done, completed_at) ON public.shift_checklists TO authenticated;
GRANT SELECT (partner_id, id_issue_date, criminal_record_status, health_cert_expiry, theoretical_score,
              practical_score, kyc_status, star_rating, total_completed_jobs, service_radius_km,
              current_location, is_active, created_at, updated_at)
  ON public.partner_profiles TO authenticated;

GRANT EXECUTE ON FUNCTION public.app_current_user_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_payout_request(UUID, UUID, NUMERIC, TEXT)           TO authenticated;
GRANT EXECUTE ON FUNCTION public.flash_claim_order(UUID, TIMESTAMPTZ, UUID)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_partner_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_waiting_orders_near(UUID)                             TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_out_shift(UUID, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_order(UUID, TIMESTAMPTZ, UUID)                    TO authenticated;

-- ---------------------------------------------------------------------
-- 16. pg_cron
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('gdx-partitions',    '0 0 20 * *', 'SELECT public.ensure_monthly_partitions(3, 0)');
    PERFORM cron.schedule('gdx-gps-retention', '30 3 * * *', $c$DELETE FROM public.partner_locations WHERE recorded_at < now() - INTERVAL '90 days'$c$);
    RAISE NOTICE 'Đã đăng ký 2 cron job: gdx-partitions, gdx-gps-retention';
  ELSE
    RAISE NOTICE 'pg_cron chưa bật → bỏ qua.';
  END IF;
END $$;

COMMIT;

SET search_path = public, extensions;

-- =====================================================================
-- PHẦN B — Dữ liệu tham chiếu (idempotent)
-- =====================================================================
INSERT INTO public.provinces (code, name, region) VALUES
  ('01','Hà Nội','Bắc'), ('79','Thành phố Hồ Chí Minh','Nam')
ON CONFLICT DO NOTHING;
INSERT INTO public.wards (code, province_code, name) VALUES
  ('00123','01','Phường Cầu Giấy'), ('00124','01','Phường Giảng Võ'), ('27601','79','Phường Bến Nghé')
ON CONFLICT DO NOTHING;

INSERT INTO public.service_categories (name, code, base_hourly_rate) VALUES
  ('Dọn dẹp nhà','CLEANING',70000), ('Nấu ăn','COOKING',80000),
  ('Giặt ủi','LAUNDRY',60000),      ('Vệ sinh sâu','DEEP_CLEAN',120000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.service_addons (code, name, default_price, unit) VALUES
  ('BRING_TOOLS','Mang dụng cụ',30000,'Lần'), ('IRONING','Ủi đồ',40000,'Giờ')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.checklist_templates (service_id, item_order, task_name, is_required)
SELECT sc.id, t.ord, t.task, t.req
FROM public.service_categories sc,
     (VALUES (1,'Quét & lau sàn',true),(2,'Lau bụi bề mặt',true),(3,'Cọ bồn cầu',false)) AS t(ord,task,req)
WHERE sc.code = 'CLEANING'
  AND NOT EXISTS (SELECT 1 FROM public.checklist_templates c WHERE c.service_id = sc.id);
