/**
 * 예약 관련 Query 훅
 */

import { MOCK_RESERVATIONS, mockDelay } from '@mocks';
import { useQuery } from '@tanstack/react-query';

import { generateQueryKeysFromUrl } from '@hooks/query-keys';
import { axiosInstance } from '../axios';
import { API } from '../endpoints';
import type { PaginatedResponse, Reservation, ReservationListParams } from '../types';

/**
 * 예약 상세 조회 훅
 */
export function useReservation(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Reservation>(API.RESERVATIONS.DETAIL(id));
      return data.data;
    },
    enabled: enabled && !!id,
  });
}

/**
 * 내 예약 목록 조회 훅
 */
export function useMyReservations(params?: ReservationListParams) {
  return useQuery({
    queryKey: [...generateQueryKeysFromUrl(API.USERS.MY_RESERVATIONS), params],
    queryFn: async (): Promise<PaginatedResponse<Reservation>> => {
      // 개발 환경에서는 Mock 데이터 반환
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

      const { data } = await axiosInstance.get<PaginatedResponse<Reservation>>(
        API.USERS.MY_RESERVATIONS,
        { params }
      );
      return data.data as unknown as PaginatedResponse<Reservation>;
    },
  });
}
