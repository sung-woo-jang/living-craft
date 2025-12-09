/**
 * Living Craft 포트폴리오 훅
 */

import { useQuery } from '@tanstack/react-query';

import * as portfoliosApi from '../api/portfolios';
import type { PortfolioListParams } from '../api/types';

/**
 * 포트폴리오 목록 조회 훅
 */
export function usePortfolios(params?: PortfolioListParams) {
  return useQuery({
    queryKey: ['portfolios', params],
    queryFn: () => portfoliosApi.getPortfolios(params),
    staleTime: 300000, // 5분
  });
}

/**
 * 포트폴리오 상세 조회 훅
 */
export function usePortfolio(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfoliosApi.getPortfolio(id),
    enabled: enabled && !!id,
    staleTime: 300000, // 5분
  });
}
