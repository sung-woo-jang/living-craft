/**
 * Living Craft 리뷰 API
 */

import apiClient from './client';
import type { CreateReviewRequest, PaginatedResponse, Review, ReviewListParams } from './types';
import { convertPageToOffset } from './types';

/**
 * 리뷰 목록 조회
 */
export async function getReviews(params?: ReviewListParams): Promise<PaginatedResponse<Review>> {
  // page를 offset으로 변환하여 백엔드로 전송
  const backendParams = params
    ? {
        ...convertPageToOffset(params),
        serviceId: params.serviceId,
        rating: params.rating,
      }
    : undefined;

  const response = await apiClient.get<PaginatedResponse<Review>>('/reviews', {
    params: backendParams,
  });
  return response.data;
}

/**
 * 리뷰 작성
 */
export async function createReview(data: CreateReviewRequest): Promise<Review> {
  const response = await apiClient.post<Review>('/reviews', data);
  return response.data;
}
