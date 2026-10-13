import { CriminalRecordStatus, KycStatus, LedgerAccountCode, OrderStatus, PaymentGateway, ScheduledSlot } from '../enums';
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
export interface FlashClaimOrderDto {
    orderId: string;
    orderCreatedAt: string;
    partnerId: string;
}
export interface RecordPartnerLocationDto {
    partnerId: string;
    longitude: number;
    latitude: number;
    accuracyM?: number;
    speedKmh?: number;
}
export interface CheckOutShiftDto {
    shiftId: string;
    longitude: number;
    latitude: number;
}
export interface CompleteOrderDto {
    orderId: string;
    orderCreatedAt: string;
    changedBy?: string;
}
export interface CreatePayoutRequestDto {
    partnerId: string;
    bankAccountId: string;
    amount: number;
    idempotencyKey: string;
}
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
export interface DoubleEntryLineDto {
    account_code: LedgerAccountCode;
    debit?: number;
    credit?: number;
    order_id?: string;
    description?: string;
}
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
export interface UpdateKycDto {
    partnerId: string;
    status: KycStatus;
    criminalRecordStatus?: CriminalRecordStatus;
    theoreticalScore?: number;
    practicalScore?: number;
    evalComments?: string;
}
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
