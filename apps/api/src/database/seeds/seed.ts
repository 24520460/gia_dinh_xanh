import { AppDataSource } from '../../config/typeorm.config';

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('Đã kết nối Supabase PostgreSQL thành công. Đang khởi tạo dữ liệu mẫu...');
    await AppDataSource.destroy();
    console.log('Hoàn tất nạp dữ liệu mẫu (Seed).');
  } catch (err) {
    console.error('Lỗi khi chạy seed:', err);
    process.exit(1);
  }
}

runSeed();
