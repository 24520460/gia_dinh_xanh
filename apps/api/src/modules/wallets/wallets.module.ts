import { Body, Controller, Get, Injectable, Module, Param, Post } from '@nestjs/common';
import { IPartnerWallet, IWalletTransaction, PartnerWalletTxType } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class WalletsService {
  constructor(private readonly db: DatabaseService) {}

  async getPartnerWallet(partnerId: string): Promise<
    IPartnerWallet & {
      availableBalance: number;
      escrowBalance: number;
      currency: string;
      transactions: IWalletTransaction[];
    }
  > {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        partner_id: string;
        current_balance: string;
        pending_balance: string;
        total_withdrawn: string;
        updated_at: string;
      }>(
        `SELECT partner_id, current_balance, pending_balance, total_withdrawn, updated_at
         FROM public.partner_wallets
         WHERE partner_id = $1::uuid`,
        [partnerId],
      );

      const txRows = await this.db.query<{
        id: string;
        created_at: string;
        partner_id: string;
        idempotency_key: string;
        transaction_type: PartnerWalletTxType;
        amount: string;
        balance_before: string;
        balance_after: string;
        order_id: string | null;
        order_created_at: string | null;
        payout_request_id: string | null;
        status: 'pending' | 'successful' | 'failed';
        description: string | null;
      }>(
        `SELECT id, created_at, partner_id, idempotency_key, transaction_type, amount,
                balance_before, balance_after, order_id, order_created_at,
                payout_request_id, status, description
         FROM public.wallet_transactions
         WHERE partner_id = $1::uuid
         ORDER BY created_at DESC
         LIMIT 50`,
        [partnerId],
      );

      if (rows[0]) {
        const w = rows[0];
        const currentBalance = Number(w.current_balance);
        const pendingBalance = Number(w.pending_balance);
        const totalWithdrawn = Number(w.total_withdrawn);
        return {
          partnerId: w.partner_id,
          currentBalance,
          pendingBalance,
          totalWithdrawn,
          updatedAt: w.updated_at,
          availableBalance: currentBalance,
          escrowBalance: pendingBalance,
          currency: 'VND',
          transactions: txRows.map((t) => ({
            id: t.id,
            createdAt: t.created_at,
            partnerId: t.partner_id,
            idempotencyKey: t.idempotency_key,
            transactionType: t.transaction_type,
            amount: Number(t.amount),
            balanceBefore: Number(t.balance_before),
            balanceAfter: Number(t.balance_after),
            orderId: t.order_id,
            orderCreatedAt: t.order_created_at,
            payoutRequestId: t.payout_request_id,
            status: t.status,
            description: t.description,
          })),
        };
      }
    }

    return {
      partnerId,
      currentBalance: 3420000,
      pendingBalance: 1200000,
      totalWithdrawn: 8500000,
      updatedAt: new Date().toISOString(),
      availableBalance: 3420000,
      escrowBalance: 1200000,
      currency: 'VND',
      transactions: [],
    };
  }

  /**
   * Calls PL/pgSQL `public.create_payout_request(p_partner_id, p_bank_account_id, p_amount, p_idempotency_key)`
   */
  async requestPayout(
    partnerId: string,
    amount: number,
    bankAccountId?: string,
    idempotencyKey?: string,
  ) {
    const idemKey = idempotencyKey || `payout-${partnerId}-${Date.now()}`;
    if (this.db.isConnected && bankAccountId) {
      const rows = await this.db.query<{ payout_id: string }>(
        `SELECT public.create_payout_request($1::uuid, $2::uuid, $3::numeric, $4) AS payout_id`,
        [partnerId, bankAccountId, amount, idemKey],
      );
      return {
        payoutId: rows[0]?.payout_id,
        partnerId,
        bankAccountId,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }

    return {
      payoutId: `PO-${Date.now()}`,
      partnerId,
      bankAccountId: bankAccountId ?? 'bank-default-001',
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Calls PL/pgSQL `public.approve_payout_request(p_payout_request_id, p_admin_id)`
   */
  async approvePayout(payoutId: string, adminId: string) {
    if (this.db.isConnected) {
      await this.db.query(`SELECT public.approve_payout_request($1::uuid, $2::uuid)`, [
        payoutId,
        adminId,
      ]);
    }
    return { payoutId, status: 'approved', approvedBy: adminId };
  }

  /**
   * Calls PL/pgSQL `public.complete_payout_request(p_payout_request_id, p_admin_id, p_external_ref)`
   */
  async completePayout(payoutId: string, adminId: string, externalRef?: string) {
    if (this.db.isConnected) {
      await this.db.query(`SELECT public.complete_payout_request($1::uuid, $2::uuid, $3)`, [
        payoutId,
        adminId,
        externalRef ?? null,
      ]);
    }
    return { payoutId, status: 'transferred', externalRef };
  }

  /**
   * Calls PL/pgSQL `public.reject_payout_request(p_payout_request_id, p_admin_id, p_reason)`
   */
  async rejectPayout(payoutId: string, adminId: string, reason: string) {
    if (this.db.isConnected) {
      await this.db.query(`SELECT public.reject_payout_request($1::uuid, $2::uuid, $3::text)`, [
        payoutId,
        adminId,
        reason,
      ]);
    }
    return { payoutId, status: 'rejected', reason };
  }
}

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(':partnerId')
  getWallet(@Param('partnerId') partnerId: string) {
    return this.walletsService.getPartnerWallet(partnerId);
  }

  @Post(':partnerId/payout')
  requestPayout(
    @Param('partnerId') partnerId: string,
    @Body('amount') amount: number,
    @Body('bankAccountId') bankAccountId?: string,
    @Body('idempotencyKey') idempotencyKey?: string,
  ) {
    return this.walletsService.requestPayout(partnerId, amount, bankAccountId, idempotencyKey);
  }

  @Post('payouts/:payoutId/approve')
  approvePayout(@Param('payoutId') payoutId: string, @Body('adminId') adminId: string) {
    return this.walletsService.approvePayout(payoutId, adminId);
  }

  @Post('payouts/:payoutId/complete')
  completePayout(
    @Param('payoutId') payoutId: string,
    @Body('adminId') adminId: string,
    @Body('externalRef') externalRef?: string,
  ) {
    return this.walletsService.completePayout(payoutId, adminId, externalRef);
  }

  @Post('payouts/:payoutId/reject')
  rejectPayout(
    @Param('payoutId') payoutId: string,
    @Body('adminId') adminId: string,
    @Body('reason') reason: string,
  ) {
    return this.walletsService.rejectPayout(payoutId, adminId, reason);
  }
}

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
