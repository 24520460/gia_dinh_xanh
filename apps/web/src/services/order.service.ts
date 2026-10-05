import {
  CompleteOrderDto,
  CreateOrderDto,
  CreateOrderReviewDto,
  FlashClaimOrderDto,
  OrderResponseDto,
  OrderStatus,
} from '@gdx/shared-types';
import { apiClient } from './api-client';

export const orderService = {
  async getOrders(): Promise<OrderResponseDto[]> {
    const { data } = await apiClient.get<OrderResponseDto[]>('/orders');
    return data;
  },

  async getOrderById(id: string): Promise<OrderResponseDto> {
    const { data } = await apiClient.get<OrderResponseDto>(`/orders/${id}`);
    return data;
  },

  async createOrder(payload: CreateOrderDto): Promise<OrderResponseDto> {
    const { data } = await apiClient.post<OrderResponseDto>('/orders', payload);
    return data;
  },

  async flashClaimOrder(orderId: string, payload: FlashClaimOrderDto): Promise<OrderResponseDto> {
    const { data } = await apiClient.post<OrderResponseDto>(`/orders/${orderId}/flash-claim`, payload);
    return data;
  },

  async completeOrder(orderId: string, payload: CompleteOrderDto): Promise<OrderResponseDto> {
    const { data } = await apiClient.post<OrderResponseDto>(`/orders/${orderId}/complete`, payload);
    return data;
  },

  async submitReview(orderId: string, payload: CreateOrderReviewDto) {
    const { data } = await apiClient.post(`/orders/${orderId}/reviews`, payload);
    return data;
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    orderCreatedAt?: string,
  ): Promise<OrderResponseDto> {
    const { data } = await apiClient.patch<OrderResponseDto>(`/orders/${orderId}/status`, {
      status,
      orderCreatedAt,
    });
    return data;
  },
};
