/**
 * Living Craft 포트폴리오 API
 */

import apiClient from './client';
import type { PaginatedResponse, Portfolio, PortfolioListParams } from './types';
import { convertPageToOffset } from './types';

/**
 * 포트폴리오 목록 조회
 */
export async function getPortfolios(params?: PortfolioListParams): Promise<PaginatedResponse<Portfolio>> {
  // page를 offset으로 변환하여 백엔드로 전송
  const backendParams = params
    ? {
        ...convertPageToOffset(params),
        category: params.category,
      }
    : undefined;

  const response = await apiClient.get<PaginatedResponse<Portfolio>>('/portfolios', { params: backendParams });
  return response.data;
}

/**
 * 포트폴리오 상세 조회
 */
export async function getPortfolio(id: number): Promise<Portfolio> {
  const response = await apiClient.get<Portfolio>(`/portfolios/${id}`);
  return response.data;
}
