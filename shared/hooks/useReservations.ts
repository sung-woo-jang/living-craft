/**
 * Living Craft 예약 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as reservationsApi from '../api/reservations';
import type { ReservationListParams } from '../api/types';
import { showErrorToast, showSuccessToast } from '../utils/toast';

/**
 * 예약 생성 훅
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsApi.createReservation,
    onSuccess: () => {
      // 예약 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      showSuccessToast('예약이 완료되었습니다.');
    },
    onError: (error) => {
      console.error('Reservation creation failed:', error);
      showErrorToast('예약 생성에 실패했습니다.');
    },
  });
}

/**
 * 예약 상세 조회 훅
 */
export function useReservation(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationsApi.getReservation(id),
    enabled: enabled && !!id,
  });
}

/**
 * 예약 취소 훅
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsApi.cancelReservation,
    onSuccess: (_data, reservationId) => {
      // 예약 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      queryClient.invalidateQueries({
        queryKey: ['reservation', reservationId],
      });
      showSuccessToast('예약이 취소되었습니다.');
    },
    onError: (error) => {
      console.error('Reservation cancellation failed:', error);
      showErrorToast('예약 취소에 실패했습니다.');
    },
  });
}

/**
 * 내 예약 목록 조회 훅
 */
export function useMyReservations(params?: ReservationListParams) {
  return useQuery({
    queryKey: ['my-reservations', params],
    queryFn: () => reservationsApi.getMyReservations(params),
  });
}
