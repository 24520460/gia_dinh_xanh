import { Body, Controller, Get, Injectable, Module, Param, Patch, Post } from '@nestjs/common';
import {
  CompleteOrderDto,
  CreateOrderDto,
  CreateOrderReviewDto,
  FlashClaimOrderDto,
  OrderResponseDto,
  OrderStatus,
  ScheduledSlot,
} from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class OrdersService {
  private fallbackOrders: OrderResponseDto[] = [];

  constructor(private readonly db: DatabaseService) {}

  private mapDbRowToDto(r: Record<string, unknown>): OrderResponseDto {
    return {
      id: String(r.id),
      createdAt: String(r.created_at),
      orderCode: String(r.order_code),
      customerId: String(r.customer_id),
      partnerId: r.partner_id ? String(r.partner_id) : null,
      serviceId: Number(r.service_id),
      voucherId: r.voucher_id ? Number(r.voucher_id) : null,
      pricingRuleId: r.pricing_rule_id ? Number(r.pricing_rule_id) : null,
      status: r.status as OrderStatus,
      addressLine: String(r.address_line ?? ''),
      wardCode: r.ward_code ? String(r.ward_code) : null,
      longitude: r.lng !== undefined ? Number(r.lng) : undefined,
      latitude: r.lat !== undefined ? Number(r.lat) : undefined,
      scheduledDate: String(r.scheduled_date),
      scheduledSlot: r.scheduled_slot as ScheduledSlot,
      durationHours: Number(r.duration_hours),
      baseAmount: Number(r.base_amount),
      addonAmount: Number(r.addon_amount ?? 0),
      surchargeAmount: Number(r.surcharge_amount ?? 0),
      discountAmount: Number(r.discount_amount ?? 0),
      finalAmount: Number(r.final_amount),
      partnerPayoutRate: Number(r.partner_payout_rate ?? 0.82),
      partnerPayoutAmount: Number(r.partner_payout_amount),
      platformFeeAmount: Number(r.platform_fee_amount),
      disputeReason: r.dispute_reason ? String(r.dispute_reason) : null,
      cancelledBy: r.cancelled_by ? String(r.cancelled_by) : null,
    };
  }

  async findAll(): Promise<OrderResponseDto[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<Record<string, unknown>>(
        `SELECT id, created_at, order_code, customer_id, partner_id, service_id,
                voucher_id, pricing_rule_id, address_line, ward_code,
                ST_X(location::geometry) AS lng,
                ST_Y(location::geometry) AS lat,
                scheduled_date, scheduled_slot, duration_hours,
                base_amount, addon_amount, surcharge_amount, discount_amount, final_amount,
                partner_payout_rate, partner_payout_amount, platform_fee_amount,
                status, dispute_reason, cancelled_by
         FROM public.orders
         ORDER BY created_at DESC
         LIMIT 100`,
      );
      return rows.map((r) => this.mapDbRowToDto(r));
    }
    return this.fallbackOrders;
  }

  async findOne(id: string): Promise<OrderResponseDto | undefined> {
    if (this.db.isConnected) {
      const rows = await this.db.query<Record<string, unknown>>(
        `SELECT id, created_at, order_code, customer_id, partner_id, service_id,
                voucher_id, pricing_rule_id, address_line, ward_code,
                ST_X(location::geometry) AS lng,
                ST_Y(location::geometry) AS lat,
                scheduled_date, scheduled_slot, duration_hours,
                base_amount, addon_amount, surcharge_amount, discount_amount, final_amount,
                partner_payout_rate, partner_payout_amount, platform_fee_amount,
                status, dispute_reason, cancelled_by
         FROM public.orders
         WHERE id::text = $1 OR order_code = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [id],
      );
      if (rows[0]) {
        return this.mapDbRowToDto(rows[0]);
      }
    }
    return this.fallbackOrders.find((o) => o.id === id || o.orderCode === id);
  }

  /**
   * Creates an order in partitioned `public.orders` matching all v2.1 CHECK invariants:
   * - `final_amount = base_amount + addon_amount + surcharge_amount - discount_amount`
   * - `partner_payout_amount + platform_fee_amount >= final_amount`
   */
  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const addressLine = dto.addressLine || 'TP. Hồ Chí Minh';
    const baseAmount = Math.round(dto.durationHours * 85000);
    const addonAmount = Math.round(dto.addonAmount ?? 0);
    const surchargeAmount = Math.round(dto.surchargeAmount ?? 0);
    const grossAmount = baseAmount + addonAmount + surchargeAmount;
    const discountAmount = Math.min(grossAmount, Math.round(dto.discountAmount ?? 0));
    const finalAmount = grossAmount - discountAmount;

    const partnerPayoutRate = dto.partnerPayoutRate ?? 0.82;
    const partnerPayoutAmount = Math.round(grossAmount * partnerPayoutRate);
    const platformFeeAmount = Math.max(0, grossAmount - partnerPayoutAmount);

    const lng = dto.longitude ?? 106.7009;
    const lat = dto.latitude ?? 10.7769;

    if (this.db.isConnected && dto.customerId) {
      const rows = await this.db.query<Record<string, unknown>>(
        `INSERT INTO public.orders (
           customer_id, service_id, voucher_id, pricing_rule_id,
           address_line, ward_code, location,
           scheduled_date, scheduled_slot, duration_hours,
           base_amount, addon_amount, surcharge_amount, discount_amount, final_amount,
           partner_payout_rate, partner_payout_amount, platform_fee_amount, status
         )
         VALUES (
           $1::uuid, $2, $3, $4,
           $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326)::geography,
           $9::date, $10, $11::numeric,
           $12::numeric, $13::numeric, $14::numeric, $15::numeric, $16::numeric,
           $17::numeric, $18::numeric, $19::numeric, 'pending_payment'
         )
         RETURNING id, created_at, order_code, customer_id, partner_id, service_id,
                   voucher_id, pricing_rule_id, address_line, ward_code,
                   scheduled_date, scheduled_slot, duration_hours,
                   base_amount, addon_amount, surcharge_amount, discount_amount, final_amount,
                   partner_payout_rate, partner_payout_amount, platform_fee_amount,
                   status, dispute_reason, cancelled_by`,
        [
          dto.customerId,
          dto.serviceId,
          dto.voucherId ?? null,
          dto.pricingRuleId ?? null,
          addressLine,
          dto.wardCode ?? 'HCM-BN',
          lng,
          lat,
          dto.scheduledDate,
          dto.scheduledSlot,
          dto.durationHours,
          baseAmount,
          addonAmount,
          surchargeAmount,
          discountAmount,
          finalAmount,
          partnerPayoutRate,
          partnerPayoutAmount,
          platformFeeAmount,
        ],
      );
      if (rows[0]) {
        return this.mapDbRowToDto(rows[0]);
      }
    }

    const order: OrderResponseDto = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      orderCode: `GDX-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: dto.customerId ?? '11111111-1111-4111-8111-111111111111',
      partnerId: null,
      serviceId: dto.serviceId,
      voucherId: dto.voucherId ?? null,
      pricingRuleId: dto.pricingRuleId ?? null,
      status: 'waiting_partner',
      addressLine,
      wardCode: dto.wardCode ?? 'HCM-BN',
      longitude: lng,
      latitude: lat,
      scheduledDate: dto.scheduledDate,
      scheduledSlot: dto.scheduledSlot,
      durationHours: dto.durationHours,
      baseAmount,
      addonAmount,
      surchargeAmount,
      discountAmount,
      finalAmount,
      partnerPayoutRate,
      partnerPayoutAmount,
      platformFeeAmount,
    };
    this.fallbackOrders.unshift(order);
    return order;
  }

  /**
   * Calls PL/pgSQL `public.flash_claim_order(p_order_id, p_order_created_at, p_partner_id)`
   */
  async flashClaim(id: string, dto: FlashClaimOrderDto) {
    if (this.db.isConnected) {
      await this.db.query(
        `SELECT public.flash_claim_order($1::uuid, $2::timestamptz, $3::uuid)`,
        [id, dto.orderCreatedAt, dto.partnerId],
      );
      return this.findOne(id);
    }

    const order = await this.findOne(id);
    if (order) {
      order.status = 'partner_assigned';
      order.partnerId = dto.partnerId;
    }
    return order;
  }

  /**
   * Calls PL/pgSQL `public.complete_order(p_order_id, p_order_created_at, p_changed_by)`
   */
  async completeOrder(id: string, dto: CompleteOrderDto) {
    if (this.db.isConnected) {
      await this.db.query(
        `SELECT public.complete_order($1::uuid, $2::timestamptz, $3::uuid)`,
        [id, dto.orderCreatedAt, dto.changedBy ?? null],
      );
      return this.findOne(id);
    }

    const order = await this.findOne(id);
    if (order) {
      order.status = 'completed';
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, orderCreatedAt?: string): Promise<OrderResponseDto | undefined> {
    if (this.db.isConnected) {
      await this.db.query(
        orderCreatedAt
          ? `UPDATE public.orders SET status = $2 WHERE id = $1::uuid AND created_at = $3::timestamptz`
          : `UPDATE public.orders SET status = $2 WHERE id::text = $1 OR order_code = $1`,
        orderCreatedAt ? [id, status, orderCreatedAt] : [id, status],
      );
      return this.findOne(id);
    }

    const order = await this.findOne(id);
    if (order) {
      order.status = status;
    }
    return order;
  }

  /**
   * Inserts into `public.order_reviews` which triggers `trg_order_reviews_rating_tip`
   */
  async submitReview(id: string, dto: CreateOrderReviewDto) {
    if (this.db.isConnected) {
      const rows = await this.db.query<{ id: string; created_at: string }>(
        `INSERT INTO public.order_reviews (
           order_id, order_created_at, customer_id, partner_id, star_rating, tip_amount, feedback_tags, comments
         )
         VALUES ($1::uuid, $2::timestamptz, $3::uuid, $4::uuid, $5, $6::numeric, $7::jsonb, $8)
         RETURNING id, created_at`,
        [
          id,
          dto.orderCreatedAt,
          dto.customerId,
          dto.partnerId,
          dto.starRating,
          dto.tipAmount ?? 0,
          JSON.stringify(dto.feedbackTags ?? []),
          dto.comments ?? null,
        ],
      );
      return {
        id: rows[0]?.id,
        orderId: id,
        starRating: dto.starRating,
        tipAmount: dto.tipAmount ?? 0,
        createdAt: rows[0]?.created_at,
      };
    }
    return {
      id: `rev-${Date.now()}`,
      orderId: id,
      starRating: dto.starRating,
      tipAmount: dto.tipAmount ?? 0,
      comments: dto.comments,
      feedbackTags: dto.feedbackTags ?? [],
      createdAt: new Date().toISOString(),
    };
  }
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Post(':id/flash-claim')
  flashClaim(@Param('id') id: string, @Body() dto: FlashClaimOrderDto) {
    return this.ordersService.flashClaim(id, dto);
  }

  @Post(':id/complete')
  completeOrder(@Param('id') id: string, @Body() dto: CompleteOrderDto) {
    return this.ordersService.completeOrder(id, dto);
  }

  @Post(':id/reviews')
  submitReview(@Param('id') id: string, @Body() dto: CreateOrderReviewDto) {
    return this.ordersService.submitReview(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('orderCreatedAt') orderCreatedAt?: string,
  ) {
    return this.ordersService.updateStatus(id, status, orderCreatedAt);
  }
}

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
