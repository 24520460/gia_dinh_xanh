import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import { OrderStatus, ScheduledSlot } from '@gdx/shared-types';

/**
 * Partitioned table `public.orders` with composite primary key `(id, created_at)`
 */
@Entity('orders')
export class OrderEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @PrimaryColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'order_code', length: 20 })
  orderCode: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'partner_id', type: 'uuid', nullable: true })
  partnerId: string | null;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ name: 'voucher_id', nullable: true })
  voucherId: number | null;

  @Column({ name: 'pricing_rule_id', nullable: true })
  pricingRuleId: number | null;

  @Column({ type: 'varchar', length: 25, default: 'pending_payment' })
  status: OrderStatus;

  @Column({ name: 'address_line', length: 255 })
  addressLine: string;

  @Column({ name: 'ward_code', length: 10, nullable: true })
  wardCode: string | null;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: string;

  @Column({ name: 'scheduled_slot', type: 'varchar', length: 20 })
  scheduledSlot: ScheduledSlot;

  @Column({ name: 'duration_hours', type: 'numeric', precision: 3, scale: 1 })
  durationHours: number;

  @Column({ name: 'base_amount', type: 'numeric', precision: 12, scale: 2 })
  baseAmount: number;

  @Column({ name: 'addon_amount', type: 'numeric', precision: 12, scale: 2, default: 0 })
  addonAmount: number;

  @Column({ name: 'surcharge_amount', type: 'numeric', precision: 12, scale: 2, default: 0 })
  surchargeAmount: number;

  @Column({ name: 'discount_amount', type: 'numeric', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'final_amount', type: 'numeric', precision: 12, scale: 2 })
  finalAmount: number;

  @Column({ name: 'partner_payout_rate', type: 'numeric', precision: 3, scale: 2, default: 0.82 })
  partnerPayoutRate: number;

  @Column({ name: 'partner_payout_amount', type: 'numeric', precision: 12, scale: 2 })
  partnerPayoutAmount: number;

  @Column({ name: 'platform_fee_amount', type: 'numeric', precision: 12, scale: 2 })
  platformFeeAmount: number;

  @Column({ name: 'dispute_reason', type: 'text', nullable: true })
  disputeReason: string | null;

  @Column({ name: 'cancelled_by', type: 'uuid', nullable: true })
  cancelledBy: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
