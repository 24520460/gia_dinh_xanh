import { CriminalRecordStatus, DisputeStatus, KycDocType, KycStatus, KycVerificationStatus, LedgerAccountCode, OrderStatus, PartnerWalletTxType, PaymentGateway, PaymentStatus, PayoutStatus, PricingDayType, PricingSlotType, ScheduledSlot, ScheduleStatus, ShiftEvidenceStage, ShiftTimerStatus, UserRole, UserStatus, VoucherDiscountType } from '../enums';
export interface IProvince {
    code: string;
    name: string;
    region?: string | null;
}
export interface IWard {
    code: string;
    provinceCode: string;
    name: string;
}
export interface IUser {
    id: string;
    fullName: string;
    phone: string;
    email?: string | null;
    role: UserRole;
    avatarUrl?: string | null;
    customerStarRating: number;
    status: UserStatus;
    createdAt: string;
    updatedAt?: string;
}
export interface IUserAddress {
    id: string;
    userId: string;
    label?: string | null;
    addressLine: string;
    wardCode: string;
    longitude: number;
    latitude: number;
    isDefault: boolean;
    createdAt: string;
}
export interface IServiceCategory {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    baseHourlyRate: number;
    isActive: boolean;
    createdAt?: string;
}
export interface IServiceAddon {
    id: number;
    code: string;
    name: string;
    defaultPrice: number;
    unit: string;
    isActive: boolean;
}
export interface IPricingRule {
    id: number;
    zoneId?: number | null;
    serviceId?: number | null;
    dayType: PricingDayType;
    slotType: PricingSlotType;
    hourlyRate?: number | null;
    surchargePct: number;
    priority: number;
    effectiveFrom: string;
    effectiveTo?: string | null;
}
export interface IChecklistTemplate {
    id: number;
    serviceId: number;
    itemOrder: number;
    taskName: string;
    isRequired: boolean;
    isActive: boolean;
}
export interface IVoucher {
    id: number;
    code: string;
    discountType: VoucherDiscountType;
    discountValue: number;
    maxDiscountAmount?: number | null;
    minOrderAmount: number;
    usageLimit?: number | null;
    perUserLimit: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}
export interface IPartnerProfile {
    partnerId: string;
    idIssueDate: string;
    criminalRecordStatus: CriminalRecordStatus;
    healthCertExpiry?: string | null;
    theoreticalScore: number;
    practicalScore: number;
    kycStatus: KycStatus;
    starRating: number;
    totalCompletedJobs: number;
    serviceRadiusKm: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface IKycDocument {
    id: string;
    partnerId: string;
    docType: KycDocType;
    fileUrl: string;
    verificationStatus: KycVerificationStatus;
    reviewerNotes?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    createdAt: string;
}
export interface IPartnerSchedule {
    id: number;
    partnerId: string;
    dayOfWeek: number;
    slotType: ScheduledSlot;
    status: ScheduleStatus;
    updatedAt?: string;
}
export interface IOrder {
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
    updatedAt: string;
}
export interface IPayment {
    id: string;
    idempotencyKey: string;
    orderId: string;
    orderCreatedAt: string;
    customerId: string;
    paymentMethodId?: string | null;
    amount: number;
    gateway: PaymentGateway;
    externalRef?: string | null;
    status: PaymentStatus;
    failureReason?: string | null;
    paidAt?: string | null;
    createdAt: string;
}
export interface IShift {
    id: string;
    orderId: string;
    orderCreatedAt: string;
    partnerId: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    timerStatus: ShiftTimerStatus;
    createdAt: string;
    updatedAt?: string;
    checklists?: IShiftChecklist[];
    evidences?: IShiftEvidence[];
}
export interface IShiftChecklist {
    id: number;
    shiftId: string;
    itemOrder: number;
    taskName: string;
    isRequired: boolean;
    isDone: boolean;
    completedAt?: string | null;
}
export interface IShiftEvidence {
    id: number;
    shiftId: string;
    stage: ShiftEvidenceStage;
    photoUrl: string;
    caption?: string | null;
    uploadedAt: string;
}
export interface IPartnerWallet {
    partnerId: string;
    currentBalance: number;
    pendingBalance: number;
    totalWithdrawn: number;
    updatedAt: string;
}
export interface IPayoutRequest {
    id: string;
    idempotencyKey: string;
    partnerId: string;
    bankAccountId: string;
    amount: number;
    status: PayoutStatus;
    externalRef?: string | null;
    rejectReason?: string | null;
    approvedBy?: string | null;
    processedAt?: string | null;
    createdAt: string;
}
export interface IWalletTransaction {
    id: string;
    createdAt: string;
    idempotencyKey: string;
    partnerId: string;
    orderId?: string | null;
    orderCreatedAt?: string | null;
    payoutRequestId?: string | null;
    transactionType: PartnerWalletTxType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    status: 'pending' | 'successful' | 'failed';
    description?: string | null;
}
export interface IPlatformLedgerEntry {
    id: number;
    entryGroupId: string;
    accountCode: LedgerAccountCode;
    orderId?: string | null;
    debitAmount: number;
    creditAmount: number;
    description?: string | null;
    createdAt: string;
}
export interface ILedgerAccountSummary {
    accountCode: LedgerAccountCode;
    totalDebit: number;
    totalCredit: number;
    netDebitMinusCredit: number;
}
export interface IDispute {
    id: string;
    orderId: string;
    orderCreatedAt: string;
    openedBy: string;
    reason: string;
    status: DisputeStatus;
    resolution?: string | null;
    refundAmount: number;
    partnerPenaltyAmount: number;
    resolvedBy?: string | null;
    resolvedAt?: string | null;
    createdAt: string;
}
export interface INotification {
    id: number;
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}
export interface OrderItem {
    id: string;
    customerName: string;
    customerPhone?: string;
    address: string;
    service: string;
    serviceType: 'clean' | 'cook' | 'deep-clean';
    partnerName: string;
    partnerRating: number;
    partnerCompletedJobs: number;
    partnerAvatar: string;
    timeSlot: string;
    date: string;
    amount: number;
    paymentMethod: string;
    status: 'pending' | 'in_progress' | 'dispute' | 'completed' | 'waiting_partner' | 'in_transit';
    statusLabel: string;
}
export interface KYCCandidate {
    id: string;
    name: string;
    age: number;
    location: string;
    avatar: string;
    submittedTime: string;
    specialties: string[];
    status: KycStatus;
    statusLabel: string;
    cccdNumber: string;
    dob: string;
    cccdIssueDate: string;
    judicialRecordNumber: string;
    hospital: string;
    examDate: string;
    hepBResult: string;
    xrayResult: string;
    theoryScore: number;
    interviewer: string;
    interviewDate: string;
    evalComments: string;
}
export type IKYCCandidate = KYCCandidate;
