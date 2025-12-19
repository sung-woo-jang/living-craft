/**
 * Living Craft 사용자 API
 */

import { MOCK_REVIEWS, MOCK_USER, mockDelay } from '@shared/mocks';

import apiClient from './client';
import type { MyReviewsParams, Review, User } from './types';

/**
 * 내 정보 조회
 */
export async function getMe(): Promise<User> {
  // 개발 환경에서는 Mock 데이터 반환
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] GET /users/me');
    await mockDelay(300);
    return MOCK_USER;
  }

  const response = await apiClient.get<User>('/users/me');
  return response.data;
}

/**
 * 내 리뷰 목록 조회
 */
export async function getMyReviews(params?: MyReviewsParams): Promise<Review[]> {
  // 개발 환경에서는 Mock 데이터 반환
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] GET /users/me/reviews');
    await mockDelay(400);
    return MOCK_REVIEWS;
  }

  const response = await apiClient.get<Review[]>('/users/me/reviews', {
    params,
  });
  return response.data;
}
