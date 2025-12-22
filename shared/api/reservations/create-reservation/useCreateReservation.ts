/**
 * 예약 생성 Mutation 훅
 */

import { showSuccessToast } from '@shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generateQueryKeysFromUrl } from '../../../hooks/query-keys';
import { axiosInstance } from '../../axios';
import { API } from '../../endpoints';
import type { CreateReservationRequest, Reservation } from '../../types';

/**
 * 예약 생성 API 함수
 */
async function createReservation(data: CreateReservationRequest): Promise<Reservation> {
  const { data: response } = await axiosInstance.post<Reservation>(
    API.RESERVATIONS.CREATE,
    data
  );
  return response.data;
}

/**
 * 예약 생성 훅
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      // 예약 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: generateQueryKeysFromUrl(API.USERS.MY_RESERVATIONS),
      });
      showSuccessToast('예약이 완료되었습니다.');
    },
  });
}
