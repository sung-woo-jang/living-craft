/**
 * Living Craft 리뷰 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as reviewsApi from '../api/reviews';
import type { ReviewListParams } from '../api/types';
import { showErrorToast, showSuccessToast } from '../utils/toast';

/**
 * 리뷰 목록 조회 훅
 */
export function useReviews(params?: ReviewListParams) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewsApi.getReviews(params),
    staleTime: 60000, // 1분
  });
}

/**
 * 리뷰 작성 훅
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      // 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      showSuccessToast('리뷰가 등록되었습니다.');
    },
    onError: (error) => {
      console.error('Review creation failed:', error);
      showErrorToast('리뷰 작성에 실패했습니다.');
    },
  });
}
