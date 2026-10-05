import {
  FlashClaimOrderDto,
  OrderResponseDto,
  PartnerProfileDto,
  RadarOrderDto,
  RecordPartnerLocationDto,
  UpdateKycDto,
} from '@gdx/shared-types';
import { apiClient } from './api-client';

export const partnerService = {
  async getNearbyJobs(lat: number, lng: number, radiusKm = 5): Promise<RadarOrderDto[]> {
    const { data } = await apiClient.get<RadarOrderDto[]>('/partners/radar', {
      params: { lat, lng, radiusKm },
    });
    return data;
  },

  async claimJob(orderId: string, payload: FlashClaimOrderDto): Promise<OrderResponseDto> {
    const { data } = await apiClient.post<OrderResponseDto>(
      `/orders/${orderId}/flash-claim`,
      payload,
    );
    return data;
  },

  async recordLocation(payload: RecordPartnerLocationDto) {
    const { partnerId, ...body } = payload;
    const { data } = await apiClient.post(`/partners/${partnerId}/location`, body);
    return data;
  },

  async getKycCandidates(): Promise<PartnerProfileDto[]> {
    const { data } = await apiClient.get<PartnerProfileDto[]>('/partners/kyc');
    return data;
  },

  async updateKycStatus(payload: UpdateKycDto): Promise<PartnerProfileDto> {
    const { data } = await apiClient.patch<PartnerProfileDto>(
      `/partners/${payload.partnerId}/kyc`,
      payload,
    );
    return data;
  },
};
