/**
 * Living Craft 예약 API
 */

import apiClient from './client';
import type { CreateReservationRequest, PaginatedResponse, Reservation, ReservationListParams } from './types';

/**
 * 예약 생성
 */
export async function createReservation(data: CreateReservationRequest): Promise<Reservation> {
  const response = await apiClient.post<Reservation>('/reservations', data);
  return response.data;
}

/**
 * 예약 상세 조회
 */
export async function getReservation(id: number): Promise<Reservation> {
  const response = await apiClient.get<Reservation>(`/reservations/${id}`);
  return response.data;
}

/**
 * 예약 취소
 */
export async function cancelReservation(id: number): Promise<Reservation> {
  const response = await apiClient.post<Reservation>(`/reservations/${id}/cancel`);
  return response.data;
}

/**
 * 내 예약 목록 조회
 */
export async function getMyReservations(params?: ReservationListParams): Promise<PaginatedResponse<Reservation>> {
  const response = await apiClient.get<PaginatedResponse<Reservation>>('/users/me/reservations', { params });
  return response.data;
}
