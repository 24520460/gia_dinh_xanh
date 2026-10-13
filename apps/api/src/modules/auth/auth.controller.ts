import { Body, Controller, Post } from '@nestjs/common';
import { OtpPurpose, UserRole } from '@gdx/shared-types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/request')
  requestOtp(
    @Body('phone') phone: string,
    @Body('purpose') purpose: OtpPurpose = 'login',
  ) {
    return this.authService.requestOtp(phone, purpose);
  }

  @Post('otp/verify')
  verifyOtp(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
    @Body('role') role: UserRole = 'customer',
  ) {
    return this.authService.verifyOtp(phone, otp, role);
  }
}
