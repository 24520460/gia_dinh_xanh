import {
  CriminalRecordStatus,
  KycStatus,
  LedgerAccountCode,
  OrderStatus,
  PaymentGateway,
  ScheduledSlot,
} from '../enums';

// DTO phản hồi đơn hàng (Bao gồm createdAt cho khóa chính kép bảng partition orders)
export interface OrderResponseDto {
  id: string;
  createdAt: string;
  orderCode: string;
  customerId: string;
  partnerId: string | null;
  serviceId: number;
  voucherId?: number | null;
  pricingRuleId?: number | null;
  status: OrderStatus;
  addressLine: string;
  wardCode?: string | null;
  longitude?: number;
  latitude?: number;
  scheduledDate: string;
  scheduledSlot: ScheduledSlot;
  durationHours: number;
  baseAmount: number;
  addonAmount: number;
  surchargeAmount: number;
  discountAmount: number;
  finalAmount: number;
  partnerPayoutRate: number;
  partnerPayoutAmount: number;
  platformFeeAmount: number;
  disputeReason?: string | null;
  cancelledBy?: string | null;
}

// DTO kết quả từ hàm find_waiting_orders_near(p_partner_id)
export interface RadarOrderDto {
  orderId: string;
  orderCreatedAt: string;
  orderCode: string;
  serviceId: number;
  serviceName: string;
  scheduledDate: string;
  scheduledSlot: ScheduledSlot;
  durationHours: number;
  finalAmount: number;
  addressLine: string;
  distanceM: number;
}

// DTO tạo đơn hàng mới (Khớp với bảng orders v2.1)
export interface CreateOrderDto {
  customerId?: string;
  serviceId: number;
  addressLine: string;
  wardCode?: string;
  longitude: number;
  latitude: number;
  scheduledDate: string;
  scheduledSlot: ScheduledSlot;
  durationHours: number;
  addonIds?: number[];
  addonAmount?: number;
  surchargeAmount?: number;
  discountAmount?: number;
  voucherId?: number;
  pricingRuleId?: number;
  partnerPayoutRate?: number;
}

// DTO Flash Claim đơn hàng (Gọi hàm public.flash_claim_order)
export interface FlashClaimOrderDto {
  orderId: string;
  orderCreatedAt: string;
  partnerId: string;
}

// DTO cập nhật GPS đối tác (Gọi hàm public.record_partner_location)
export interface RecordPartnerLocationDto {
  partnerId: string;
  longitude: number;
  latitude: number;
  accuracyM?: number;
  speedKmh?: number;
}

// DTO kết ca làm việc (Gọi hàm public.check_out_shift)
export interface CheckOutShiftDto {
  shiftId: string;
  longitude: number;
  latitude: number;
}

// DTO hoàn thành đơn hàng (Gọi hàm public.complete_order)
export interface CompleteOrderDto {
  orderId: string;
  orderCreatedAt: string;
  changedBy?: string;
}

// DTO tạo lệnh rút tiền (Gọi hàm public.create_payout_request)
export interface CreatePayoutRequestDto {
  partnerId: string;
  bankAccountId: string;
  amount: number;
  idempotencyKey: string;
}

// DTO tạo giao dịch thanh toán (Bảng payments v2.1)
export interface CreatePaymentDto {
  idempotencyKey: string;
  orderId: string;
  orderCreatedAt: string;
  customerId: string;
  paymentMethodId?: string;
  amount: number;
  gateway: PaymentGateway;
  externalRef?: string;
}

// DTO bút toán kép (Gọi hàm public.post_double_entries)
export interface DoubleEntryLineDto {
  account_code: LedgerAccountCode;
  debit?: number;
  credit?: number;
  order_id?: string;
  description?: string;
}

// DTO hồ sơ đối tác
export interface PartnerProfileDto {
  partnerId: string;
  fullName: string;
  phone: string;
  starRating: number;
  totalCompletedJobs: number;
  serviceRadiusKm: number;
  isActive: boolean;
  kycStatus: KycStatus;
  criminalRecordStatus?: CriminalRecordStatus;
  theoreticalScore?: number;
  practicalScore?: number;
}

// DTO cập nhật trạng thái duyệt KYC
export interface UpdateKycDto {
  partnerId: string;
  status: KycStatus;
  criminalRecordStatus?: CriminalRecordStatus;
  theoreticalScore?: number;
  practicalScore?: number;
  evalComments?: string;
}

// DTO đánh giá đơn hàng (Bảng order_reviews v2.1)
export interface CreateOrderReviewDto {
  orderId: string;
  orderCreatedAt: string;
  customerId: string;
  partnerId: string;
  starRating: number;
  tipAmount?: number;
  feedbackTags?: string[];
  comments?: string;
}
