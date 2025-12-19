/**
 * Living Craft 예약 API
 */

import { MOCK_RESERVATIONS, mockDelay } from '@shared/mocks';

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
  // 개발 환경에서는 Mock 데이터 반환
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] GET /users/me/reservations');
    await mockDelay(400);
    return {
      success: true,
      message: '예약 목록 조회 성공',
      data: MOCK_RESERVATIONS,
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: MOCK_RESERVATIONS.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      timestamp: new Date().toISOString(),
    };
  }

  const response = await apiClient.get<PaginatedResponse<Reservation>>('/users/me/reservations', { params });
  return response.data;
}
