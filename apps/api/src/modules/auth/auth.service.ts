import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IUser, OtpPurpose, UserRole } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  private hashValue(val: string): string {
    return createHash('sha256').update(val).digest('hex');
  }

  async requestOtp(phone: string, purpose: OtpPurpose = 'login') {
    const otpCode = '123456'; // Demo OTP for development
    if (this.db.isConnected) {
      await this.db.query(
        `INSERT INTO public.otp_codes (phone, otp_hash, purpose, expires_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP + INTERVAL '5 minutes')`,
        [phone, this.hashValue(otpCode), purpose],
      );
    }

    return {
      success: true,
      phone,
      purpose,
      message: 'Mã OTP xác thực đã được gửi tới số điện thoại của bạn.',
    };
  }

  async verifyOtp(phone: string, otp: string, role: UserRole = 'customer') {
    if (this.db.isConnected) {
      const otpHash = this.hashValue(otp);
      await this.db.query(
        `UPDATE public.otp_codes
         SET consumed_at = CURRENT_TIMESTAMP
         WHERE phone = $1 AND otp_hash = $2 AND consumed_at IS NULL AND expires_at > CURRENT_TIMESTAMP`,
        [phone, otpHash],
      );

      const userRows = await this.db.query<{
        id: string;
        phone: string;
        email: string | null;
        full_name: string;
        role: UserRole;
        avatar_url: string | null;
        customer_star_rating: string;
        status: IUser['status'];
        created_at: string;
        updated_at: string;
      }>(
        `INSERT INTO public.users (phone, password_hash, full_name, role, status)
         VALUES ($1, $2, $3, $4, 'active')
         ON CONFLICT (phone) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
         RETURNING id, phone, email, full_name, role, avatar_url, customer_star_rating, status, created_at, updated_at`,
        [phone, this.hashValue(`otp-auth-${phone}`), 'Khách Hàng Gia Đình Xanh', role],
      );

      const u = userRows[0];
      const refreshToken = `gdx-refresh-${u.id}-${Date.now()}`;
      await this.db.query(
        `INSERT INTO public.user_sessions (user_id, refresh_token_hash, device_info, expires_at)
         VALUES ($1::uuid, $2, $3, CURRENT_TIMESTAMP + INTERVAL '30 days')`,
        [u.id, this.hashValue(refreshToken), 'Web Client'],
      );

      const user: IUser = {
        id: u.id,
        phone: u.phone,
        email: u.email,
        fullName: u.full_name,
        role: u.role,
        avatarUrl: u.avatar_url,
        customerStarRating: Number(u.customer_star_rating),
        status: u.status,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      };

      return {
        accessToken: `gdx-jwt-token-${user.id}`,
        refreshToken,
        user,
      };
    }

    const user: IUser = {
      id: '11111111-1111-4111-8111-111111111111',
      phone,
      fullName: 'Khách Hàng Gia Đình Xanh',
      role,
      customerStarRating: 5.0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return {
      accessToken: `mock-jwt-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
      user,
    };
  }
}
