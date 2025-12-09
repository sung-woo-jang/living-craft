/**
 * Living Craft 사용자 API
 */

import apiClient from './client';
import type { MyReviewsParams, Review, User } from './types';

/**
 * 내 정보 조회
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
}

/**
 * 내 리뷰 목록 조회
 */
export async function getMyReviews(params?: MyReviewsParams): Promise<Review[]> {
  const response = await apiClient.get<Review[]>('/users/me/reviews', {
    params,
  });
  return response.data;
}
