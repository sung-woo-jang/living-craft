/**
 * Living Craft 서비스 API
 */

import apiClient from './client';
import type {
  AvailableDatesRequest,
  AvailableDatesResponse,
  AvailableTimesRequest,
  AvailableTimesResponse,
  Service,
} from './types';

/**
 * 서비스 목록 조회
 * - 서비스 가능 지역 정보 포함
 */
export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>('/services');

  // Backend 응답의 id가 string이므로 number로 변환
  return response.data.map((service) => ({
    ...service,
    id: typeof service.id === 'string' ? parseInt(service.id, 10) : service.id,
  }));
}

/**
 * 예약 가능 시간 조회
 */
export async function getAvailableTimes(params: AvailableTimesRequest): Promise<AvailableTimesResponse> {
  const response = await apiClient.post<AvailableTimesResponse>('/services/available-times', params);
  return response.data;
}

/**
 * 월별 예약 가능 날짜 조회
 * - 해당 월의 예약 불가능한 날짜 목록 반환
 * - 캘린더에서 disabled 처리할 날짜 표시에 사용
 */
export async function getAvailableDates(params: AvailableDatesRequest): Promise<AvailableDatesResponse> {
  const response = await apiClient.post<AvailableDatesResponse>('/services/available-dates', params);
  return response.data;
}
