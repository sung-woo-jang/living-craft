/**
 * Living Craft 프로모션 배너 API
 */

import apiClient from './client';
import type { Promotion, PromotionListResponseDto } from './types';

/**
 * 활성 프로모션 배너 목록 조회
 * 게시 기간 내이고 활성화된 배너만 반환
 */
export async function getPromotions(): Promise<Promotion[]> {
  const response = await apiClient.get<PromotionListResponseDto>('/promotions');
  return response.data.items;
}

/**
 * 프로모션 배너 클릭 통계 증가
 * @param id 프로모션 배너 ID
 */
export async function incrementPromotionClick(id: string): Promise<void> {
  await apiClient.post(`/promotions/${id}/click`);
}
