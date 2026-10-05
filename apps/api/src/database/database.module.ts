import { Global, Injectable, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private connected = false;

  get dataSource(): DataSource {
    return AppDataSource;
  }

  get isConnected(): boolean {
    return this.connected && AppDataSource.isInitialized;
  }

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl || dbUrl.includes('[PROJECT_REF]') || dbUrl.includes('[YOUR_PASSWORD]')) {
      this.logger.warn(
        'DATABASE_URL đang ở dạng mẫu (.env.example). Backend chạy chế độ In-Memory Fallback cho tới khi điền URI Supabase thật.',
      );
      return;
    }

    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      this.connected = true;
      this.logger.log('Đã kết nối thành công tới Supabase PostgreSQL 16 (Schema v2.1)!');
    } catch (error: any) {
      this.connected = false;
      this.logger.error(`Không thể kết nối tới Supabase PostgreSQL: ${error?.message}`);
    }
  }

  async onModuleDestroy() {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  /**
   * Thực thi truy vấn SQL hoặc gọi hàm SECURITY DEFINER trong ngữ cảnh GUC `app.current_user_id`
   * khớp với hàm `public.app_current_user_id()` trong CSDL v2.1.
   */
  async withUserContext<T>(
    userId: string | undefined,
    callback: (runner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      await runner.query(`SET LOCAL search_path = public, extensions`);
      if (userId) {
        await runner.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]);
      }
      const result = await callback(runner);
      await runner.commitTransaction();
      return result;
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return AppDataSource.query(sql, params);
  }
}

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
