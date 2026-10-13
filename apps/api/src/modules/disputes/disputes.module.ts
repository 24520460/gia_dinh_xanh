import { Body, Controller, Get, Injectable, Module, Param, Patch, Post } from '@nestjs/common';
import { DisputeStatus, IDispute } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class DisputesService {
  private fallbackDisputes: IDispute[] = [];

  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<IDispute[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        order_id: string;
        order_created_at: string;
        opened_by: string;
        reason: string;
        status: DisputeStatus;
        resolution: string | null;
        refund_amount: string;
        partner_penalty_amount: string;
        resolved_by: string | null;
        created_at: string;
        resolved_at: string | null;
      }>(`SELECT * FROM public.disputes ORDER BY created_at DESC LIMIT 100`);

      return rows.map((r) => ({
        id: r.id,
        orderId: r.order_id,
        orderCreatedAt: r.order_created_at,
        openedBy: r.opened_by,
        reason: r.reason,
        status: r.status,
        resolution: r.resolution,
        refundAmount: Number(r.refund_amount),
        partnerPenaltyAmount: Number(r.partner_penalty_amount),
        resolvedBy: r.resolved_by,
        createdAt: r.created_at,
        resolvedAt: r.resolved_at,
      }));
    }
    return this.fallbackDisputes;
  }

  async create(payload: {
    orderId: string;
    orderCreatedAt?: string;
    openedBy?: string;
    reason: string;
  }): Promise<IDispute> {
    const orderCreatedAt = payload.orderCreatedAt ?? new Date().toISOString();
    const openedBy = payload.openedBy ?? '11111111-1111-4111-8111-111111111111';

    if (this.db.isConnected && payload.orderCreatedAt && payload.openedBy) {
      const rows = await this.db.query<{ id: string; created_at: string }>(
        `INSERT INTO public.disputes (order_id, order_created_at, opened_by, reason, status)
         VALUES ($1::uuid, $2::timestamptz, $3::uuid, $4, 'open')
         RETURNING id, created_at`,
        [payload.orderId, orderCreatedAt, openedBy, payload.reason],
      );

      return {
        id: rows[0].id,
        orderId: payload.orderId,
        orderCreatedAt,
        openedBy,
        reason: payload.reason,
        status: 'open',
        refundAmount: 0,
        partnerPenaltyAmount: 0,
        createdAt: rows[0].created_at,
      };
    }

    const item: IDispute = {
      id: `DSP-${Date.now()}`,
      orderId: payload.orderId,
      orderCreatedAt,
      openedBy,
      reason: payload.reason,
      status: 'open',
      refundAmount: 0,
      partnerPenaltyAmount: 0,
      createdAt: new Date().toISOString(),
    };
    this.fallbackDisputes.push(item);
    return item;
  }

  async resolveDispute(
    disputeId: string,
    payload: {
      status: DisputeStatus;
      resolution: string;
      refundAmount?: number;
      partnerPenaltyAmount?: number;
      resolvedBy?: string;
    },
  ) {
    if (this.db.isConnected) {
      await this.db.query(
        `UPDATE public.disputes
         SET status = $2,
             resolution = $3,
             refund_amount = COALESCE($4, refund_amount),
             partner_penalty_amount = COALESCE($5, partner_penalty_amount),
             resolved_by = $6::uuid,
             resolved_at = CURRENT_TIMESTAMP
         WHERE id = $1::uuid`,
        [
          disputeId,
          payload.status,
          payload.resolution,
          payload.refundAmount ?? 0,
          payload.partnerPenaltyAmount ?? 0,
          payload.resolvedBy ?? null,
        ],
      );
    }
    return {
      id: disputeId,
      ...payload,
      resolvedAt: new Date().toISOString(),
    };
  }
}

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  findAll() {
    return this.disputesService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      orderId: string;
      orderCreatedAt?: string;
      openedBy?: string;
      reason: string;
    },
  ) {
    return this.disputesService.create(body);
  }

  @Patch(':id/resolve')
  resolve(
    @Param('id') id: string,
    @Body()
    body: {
      status: DisputeStatus;
      resolution: string;
      refundAmount?: number;
      partnerPenaltyAmount?: number;
      resolvedBy?: string;
    },
  ) {
    return this.disputesService.resolveDispute(id, body);
  }
}

@Module({
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
