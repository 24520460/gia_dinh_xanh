import { Body, Controller, Get, Injectable, Module, Param, Post } from '@nestjs/common';
import { CustomerWalletTxType, PaymentGateway } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class PaymentsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Inserts a payment record into `public.payments` and transitions `public.orders`
   * from `pending_payment` to `waiting_partner` (satisfying `trg_orders_guard`).
   */
  async createPaymentIntent(
    orderId: string,
    gateway: PaymentGateway,
    amount: number,
    options?: {
      orderCreatedAt?: string;
      customerId?: string;
      idempotencyKey?: string;
    },
  ) {
    const idempotencyKey = options?.idempotencyKey || `pay-${orderId}-${Date.now()}`;

    if (this.db.isConnected && options?.orderCreatedAt && options?.customerId) {
      const rows = await this.db.query<{ id: string; paid_at: string }>(
        `INSERT INTO public.payments (
           idempotency_key, order_id, order_created_at, customer_id, amount, gateway, status, paid_at
         )
         VALUES ($1, $2::uuid, $3::timestamptz, $4::uuid, $5::numeric, $6, 'successful', CURRENT_TIMESTAMP)
         ON CONFLICT (idempotency_key) DO UPDATE SET status = 'successful'
         RETURNING id, paid_at`,
        [idempotencyKey, orderId, options.orderCreatedAt, options.customerId, amount, gateway],
      );

      // Transition order from pending_payment -> waiting_partner now that payment is successful
      await this.db.query(
        `UPDATE public.orders
         SET status = 'waiting_partner'
         WHERE id = $1::uuid AND created_at = $2::timestamptz AND status = 'pending_payment'`,
        [orderId, options.orderCreatedAt],
      );

      return {
        transactionId: rows[0]?.id ?? idempotencyKey,
        idempotencyKey,
        orderId,
        gateway,
        amount,
        status: 'successful',
        paidAt: rows[0]?.paid_at ?? new Date().toISOString(),
      };
    }

    return {
      transactionId: `PAY-${Date.now()}`,
      idempotencyKey,
      orderId,
      gateway,
      amount,
      status: 'successful',
      paidAt: new Date().toISOString(),
    };
  }

  async getCustomerWallet(customerId: string) {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        customer_id: string;
        current_balance: string;
        updated_at: string;
      }>(
        `SELECT customer_id, current_balance, updated_at FROM public.customer_wallets WHERE customer_id = $1::uuid`,
        [customerId],
      );
      if (rows[0]) {
        return {
          customerId: rows[0].customer_id,
          currentBalance: Number(rows[0].current_balance),
          updatedAt: rows[0].updated_at,
        };
      }
    }
    return {
      customerId,
      currentBalance: 500000,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calls PL/pgSQL `public.apply_customer_wallet_transaction(p_customer_id, p_transaction_type, p_amount, p_idempotency_key, p_payment_id, p_external_ref, p_description)`
   */
  async applyCustomerWalletTx(payload: {
    customerId: string;
    transactionType: CustomerWalletTxType;
    amount: number;
    idempotencyKey: string;
    paymentId?: string;
    externalRef?: string;
    description?: string;
  }) {
    if (this.db.isConnected) {
      const rows = await this.db.query<{ tx_id: string }>(
        `SELECT public.apply_customer_wallet_transaction(
           $1::uuid, $2, $3::numeric, $4, $5::uuid, $6, $7
         ) AS tx_id`,
        [
          payload.customerId,
          payload.transactionType,
          payload.amount,
          payload.idempotencyKey,
          payload.paymentId ?? null,
          payload.externalRef ?? null,
          payload.description ?? null,
        ],
      );
      return { txId: rows[0]?.tx_id, status: 'successful' };
    }
    return { txId: `cwtx-${Date.now()}`, status: 'successful' };
  }
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  createIntent(
    @Body('orderId') orderId: string,
    @Body('method') method: PaymentGateway = 'vnpay',
    @Body('gateway') gateway: PaymentGateway | undefined,
    @Body('amount') amount: number,
    @Body('orderCreatedAt') orderCreatedAt?: string,
    @Body('customerId') customerId?: string,
    @Body('idempotencyKey') idempotencyKey?: string,
  ) {
    return this.paymentsService.createPaymentIntent(orderId, gateway ?? method, amount, {
      orderCreatedAt,
      customerId,
      idempotencyKey,
    });
  }

  @Get('customer-wallet/:customerId')
  getCustomerWallet(@Param('customerId') customerId: string) {
    return this.paymentsService.getCustomerWallet(customerId);
  }

  @Post('customer-wallet/tx')
  applyCustomerWalletTx(
    @Body()
    body: {
      customerId: string;
      transactionType: CustomerWalletTxType;
      amount: number;
      idempotencyKey: string;
      paymentId?: string;
      externalRef?: string;
      description?: string;
    },
  ) {
    return this.paymentsService.applyCustomerWalletTx(body);
  }
}

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
