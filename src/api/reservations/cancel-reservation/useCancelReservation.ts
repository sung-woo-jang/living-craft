/**
 * 예약 취소 Mutation 훅
 */

import type { Reservation } from '@api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccessToast } from '@utils/toast';

import { generateQueryKeysFromUrl } from '../../../hooks/query-keys';
import { axiosInstance } from '../../axios';
import { API } from '../../endpoints';

/**
 * 예약 취소 API 함수
 */
async function cancelReservation(id: number): Promise<Reservation> {
  const { data } = await axiosInstance.post<Reservation>(API.RESERVATIONS.CANCEL(id));
  return data.data;
}

/**
 * 예약 취소 훅
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: (_data, reservationId) => {
      // 예약 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: generateQueryKeysFromUrl(API.USERS.MY_RESERVATIONS),
      });
      queryClient.invalidateQueries({
        queryKey: ['reservation', reservationId],
      });
      showSuccessToast('예약이 취소되었습니다.');
    },
  });
}
