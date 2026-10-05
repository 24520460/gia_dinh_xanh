import { IUser, UserRole } from '@gdx/shared-types';
import { apiClient } from './api-client';

export const authService = {
  async requestOtp(phone: string) {
    const { data } = await apiClient.post<{ success: boolean; message: string }>('/auth/otp/request', { phone });
    return data;
  },

  async verifyOtp(phone: string, otp: string, role: UserRole = 'customer') {
    const { data } = await apiClient.post<{ accessToken: string; user: IUser }>('/auth/otp/verify', {
      phone,
      otp,
      role,
    });
    if (data.accessToken) {
      localStorage.setItem('gdx_access_token', data.accessToken);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('gdx_access_token');
  },
};
