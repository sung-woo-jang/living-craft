/**
 * Living Craft 프로모션 배너 API
 */

import apiClient from './client';
import type { Promotion } from './types';

/**
 * 활성 프로모션 배너 목록 조회
 * 게시 기간 내이고 활성화된 배열만 반환
 *
 * Note: apiClient interceptor가 SuccessResponse.data를 자동 추출하므로
 * response.data가 이미 Promotion[] 배열입니다.
 */
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const response = await apiClient.get<Promotion[]>('/promotions');
    return response.data ?? [];
  } catch (error) {
    console.error('[Promotions API] 조회 실패:', error);
    return [];
  }
}

/**
 * 프로모션 배너 클릭 통계 증가
 * @param id 프로모션 배너 ID
 */
export async function incrementPromotionClick(id: number): Promise<void> {
  await apiClient.post(`/promotions/${id}/click`);
}
