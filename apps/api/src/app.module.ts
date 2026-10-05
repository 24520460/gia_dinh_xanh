import { Controller, Get, Module } from '@nestjs/common';
import { DatabaseModule, DatabaseService } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ServicesModule } from './modules/services/services.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Controller()
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get('health')
  check() {
    return {
      status: 'ok',
      service: '@gdx/api',
      schemaVersion: 'v2.1.0',
      database: 'Supabase Managed PostgreSQL 16 (PostGIS + pgcrypto)',
      dbConnected: this.db.isConnected,
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    PartnersModule,
    ServicesModule,
    OrdersModule,
    ShiftsModule,
    PaymentsModule,
    WalletsModule,
    LedgerModule,
    DisputesModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
