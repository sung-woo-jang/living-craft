/**
 * Living Craft 사용자 훅
 */

import { useQuery } from '@tanstack/react-query';

import type { MyReviewsParams } from '../api/types';
import * as usersApi from '../api/users';

/**
 * 내 정보 조회 훅
 */
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.getMe,
    staleTime: 300000, // 5분
  });
}

/**
 * 내 리뷰 목록 조회 훅
 */
export function useMyReviews(params?: MyReviewsParams) {
  return useQuery({
    queryKey: ['my-reviews', params],
    queryFn: () => usersApi.getMyReviews(params),
  });
}
