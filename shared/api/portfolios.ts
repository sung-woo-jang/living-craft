/**
 * Living Craft 포트폴리오 API
 */

import apiClient from './client';
import type {
  PaginatedResponse,
  Portfolio,
  PortfolioDetailDto,
  PortfolioListParams,
  PortfolioListResponseDto,
  Service,
} from './types';
import { convertPageToOffset } from './types';

/**
 * 포트폴리오 목록 조회
 * 백엔드 응답을 프론트엔드 형식으로 변환
 *
 * 참고: Axios 인터셉터가 SuccessResponse를 자동 언래핑하므로
 * response.data는 이미 { items, total } 형태입니다.
 */
export async function getPortfolios(params?: PortfolioListParams): Promise<PaginatedResponse<Portfolio>> {
  // page를 offset으로 변환하여 백엔드로 전송
  const backendParams = params
    ? {
        ...convertPageToOffset(params),
        category: params.category,
      }
    : undefined;

  // 인터셉터가 SuccessResponse를 자동 언래핑하므로 response.data는 PortfolioListResponseDto
  const response = await apiClient.get<PortfolioListResponseDto>('/portfolios', {
    params: backendParams,
  });

  const { items, total } = response.data;
  const limit = params?.limit || 10;

  // 백엔드 DTO → 프론트엔드 Portfolio 변환
  const portfolios: Portfolio[] = items.map((item) => ({
    id: Number(item.id),
    category: item.category,
    projectName: item.projectName,
    description: item.description,
    images: item.thumbnailImage ? [item.thumbnailImage] : [],
    tags: item.tags || [],
    // 목록에서는 제공되지 않는 필드들 (상세에서만 제공)
    client: undefined,
    duration: '',
    detailedDescription: '',
    service: {} as Service,
    serviceId: 0,
    isActive: true,
    sortOrder: 0,
    createdAt: '',
    updatedAt: '',
  }));

  return {
    success: true,
    message: '포트폴리오 목록 조회 성공',
    data: portfolios,
    meta: {
      currentPage: params?.page || 1,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: (params?.page || 1) * limit < total,
      hasPreviousPage: (params?.page || 1) > 1,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * 포트폴리오 상세 조회
 * 백엔드 응답을 프론트엔드 형식으로 변환
 *
 * 참고: Axios 인터셉터가 SuccessResponse를 자동 언래핑하므로
 * response.data는 이미 PortfolioDetailDto 형태입니다.
 */
export async function getPortfolio(id: number): Promise<Portfolio> {
  // 인터셉터가 SuccessResponse를 자동 언래핑하므로 response.data는 PortfolioDetailDto
  const response = await apiClient.get<PortfolioDetailDto>(`/portfolios/${id}`);

  const detail = response.data;

  return {
    id: Number(detail.id),
    category: detail.category,
    projectName: detail.projectName,
    client: detail.client,
    duration: detail.duration,
    description: '', // 상세에서는 detailedDescription만 제공
    detailedDescription: detail.detailedDescription,
    images: detail.images || [],
    tags: detail.tags || [],
    service: {} as Service,
    serviceId: Number(detail.relatedServiceId),
    isActive: true,
    sortOrder: 0,
    createdAt: '',
    updatedAt: '',
  };
}
