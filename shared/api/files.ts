/**
 * Living Craft 파일 업로드 API
 */

import apiClient from './client';
import type { MultipleImageUploadResponse } from './types';

/**
 * 리뷰 이미지 업로드 (다중)
 * - 최대 5개
 */
export async function uploadReviewImages(files: File[]): Promise<MultipleImageUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<MultipleImageUploadResponse>('/files/upload/review-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * 예약 이미지 업로드 (다중)
 * - 예약 생성 시 사용
 */
export async function uploadReservationImages(files: File[]): Promise<MultipleImageUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<MultipleImageUploadResponse>(
    '/files/upload/review-images', // 백엔드에 예약 이미지 업로드 엔드포인트가 없으면 리뷰용 사용
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
