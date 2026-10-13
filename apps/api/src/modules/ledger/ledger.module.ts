import { Body, Controller, Get, Injectable, Module, Post } from '@nestjs/common';
import {
  DoubleEntryLineDto,
  ILedgerAccountSummary,
  IPlatformLedgerEntry,
  LedgerAccountCode,
} from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class LedgerService {
  constructor(private readonly db: DatabaseService) {}

  async getEntries(): Promise<IPlatformLedgerEntry[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        entry_group_id: string;
        account_code: LedgerAccountCode;
        order_id: string | null;
        debit_amount: string;
        credit_amount: string;
        description: string | null;
        created_at: string;
      }>(
        `SELECT id, entry_group_id, account_code, order_id, debit_amount, credit_amount, description, created_at
         FROM public.platform_ledger
         ORDER BY created_at DESC
         LIMIT 100`,
      );
      return rows.map((r) => ({
        id: Number(r.id),
        entryGroupId: r.entry_group_id,
        accountCode: r.account_code,
        orderId: r.order_id,
        debitAmount: Number(r.debit_amount),
        creditAmount: Number(r.credit_amount),
        description: r.description,
        createdAt: r.created_at,
      }));
    }

    const groupId = '33333333-3333-4333-8333-333333333333';
    return [
      {
        id: 1,
        entryGroupId: groupId,
        accountCode: 'CASH_GATEWAY',
        orderId: null,
        debitAmount: 255000,
        creditAmount: 0,
        description: 'Ghi nhận Nợ CASH_GATEWAY đơn #GDX-100001',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        entryGroupId: groupId,
        accountCode: 'PARTNER_PAYABLE',
        orderId: null,
        debitAmount: 0,
        creditAmount: 209100,
        description: 'Ghi nhận Có PARTNER_PAYABLE (82%) đơn #GDX-100001',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        entryGroupId: groupId,
        accountCode: 'PLATFORM_REVENUE',
        orderId: null,
        debitAmount: 0,
        creditAmount: 45900,
        description: 'Ghi nhận Có PLATFORM_REVENUE (18%) đơn #GDX-100001',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Queries `public.v_ledger_account_summary` and `public.v_ledger_unbalanced_groups`
   */
  async getSummary(): Promise<{
    accounts: ILedgerAccountSummary[];
    unbalancedGroupsCount: number;
  }> {
    if (this.db.isConnected) {
      const accountsRows = await this.db.query<{
        account_code: LedgerAccountCode;
        total_debit: string;
        total_credit: string;
        net_debit_minus_credit: string;
      }>(`SELECT * FROM public.v_ledger_account_summary ORDER BY account_code`);

      const unbalancedRows = await this.db.query<{ entry_group_id: string }>(
        `SELECT entry_group_id FROM public.v_ledger_unbalanced_groups`,
      );

      return {
        accounts: accountsRows.map((a) => ({
          accountCode: a.account_code,
          totalDebit: Number(a.total_debit),
          totalCredit: Number(a.total_credit),
          netDebitMinusCredit: Number(a.net_debit_minus_credit),
        })),
        unbalancedGroupsCount: unbalancedRows.length,
      };
    }

    return {
      accounts: [
        {
          accountCode: 'CASH_GATEWAY',
          totalDebit: 255000,
          totalCredit: 0,
          netDebitMinusCredit: 255000,
        },
        {
          accountCode: 'PARTNER_PAYABLE',
          totalDebit: 0,
          totalCredit: 209100,
          netDebitMinusCredit: -209100,
        },
        {
          accountCode: 'PLATFORM_REVENUE',
          totalDebit: 0,
          totalCredit: 45900,
          netDebitMinusCredit: -45900,
        },
      ],
      unbalancedGroupsCount: 0,
    };
  }

  /**
   * Calls PL/pgSQL `public.post_double_entries(p_entries, p_entry_group_id, p_description)`
   */
  async postDoubleEntries(payload: {
    groupId: string;
    description?: string;
    lines: DoubleEntryLineDto[];
  }) {
    if (this.db.isConnected) {
      await this.db.query(
        `SELECT public.post_double_entries($1::jsonb, $2::uuid, $3)`,
        [JSON.stringify(payload.lines), payload.groupId, payload.description ?? null],
      );
    }
    return {
      success: true,
      entryGroupId: payload.groupId,
      linesCount: payload.lines.length,
    };
  }
}

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  findAll() {
    return this.ledgerService.getEntries();
  }

  @Get('summary')
  getSummary() {
    return this.ledgerService.getSummary();
  }

  @Post('entries')
  postDoubleEntries(
    @Body()
    body: {
      groupId: string;
      description?: string;
      lines: DoubleEntryLineDto[];
    },
  ) {
    return this.ledgerService.postDoubleEntries(body);
  }
}

@Module({
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
