/**
 * Living Craft 프로모션 배너 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as promotionsApi from '../api/promotions';

/**
 * 프로모션 배너 목록 조회 훅
 * 게시 기간 내이고 활성화된 배너만 반환
 */
export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getPromotions(),
    staleTime: 60000, // 1분
  });
}

/**
 * 프로모션 배너 클릭 통계 증가 훅
 */
export function useIncrementPromotionClick() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promotionsApi.incrementPromotionClick(id),
    onSuccess: () => {
      // 클릭 후 목록 갱신 (옵션, 통계 반영 시)
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}
