/**
 * Living Craft 서비스 API
 */

import apiClient from './client';
import type { AvailableTimesRequest, AvailableTimesResponse, Service } from './types';

/**
 * 서비스 목록 조회
 * - 서비스 가능 지역 정보 포함
 */
export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>('/services');
  return response.data;
}

/**
 * 예약 가능 시간 조회
 */
export async function getAvailableTimes(params: AvailableTimesRequest): Promise<AvailableTimesResponse> {
  const response = await apiClient.post<AvailableTimesResponse>('/services/available-times', params);
  return response.data;
}
