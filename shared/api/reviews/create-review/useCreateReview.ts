/**
 * 리뷰 작성 Mutation 훅
 */

import { showSuccessToast } from '@shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generateQueryKeysFromUrl } from '../../../hooks/query-keys';
import { axiosInstance } from '../../axios';
import { API } from '../../endpoints';
import type { CreateReviewRequest, Review } from '../../types';

/**
 * 리뷰 작성 API 함수
 */
async function createReview(data: CreateReviewRequest): Promise<Review> {
  const { data: response } = await axiosInstance.post<Review>(API.REVIEWS.CREATE, data);
  return response.data;
}

/**
 * 리뷰 작성 훅
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: generateQueryKeysFromUrl(API.REVIEWS.LIST),
      });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      showSuccessToast('리뷰가 등록되었습니다.');
    },
  });
}
