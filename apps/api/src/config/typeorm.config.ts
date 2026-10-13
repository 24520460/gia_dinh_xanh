import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// Tự động nạp biến môi trường từ apps/api/.env hoặc .env ở thư mục gốc Monorepo
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Bắt buộc khi kết nối qua SSL tới Supabase
  },
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false, // TUYỆT ĐỐI FALSE; quản lý qua SQL/Migration v2.1
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 20, // Giới hạn kích thước pool kết nối tránh tràn connection limit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Tự động nạp schema public và extensions (postgis, pgcrypto) theo thiết kế v2.1
    options: '-c search_path=public,extensions',
  },
});
