/**
 * Living Craft 서비스 훅
 */

import { useQuery } from '@tanstack/react-query';

import * as servicesApi from '../api/services';
import type { TimeType } from '../api/types';

/**
 * 서비스 목록 조회 훅
 */
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getServices,
    staleTime: 300000, // 5분 (서비스 정보는 자주 바뀌지 않음)
  });
}

/**
 * 예약 가능 시간 조회 훅
 * @param serviceId 서비스 ID
 * @param date 조회 날짜 (YYYY-MM-DD)
 * @param type 시간 타입 (estimate: 견적, construction: 시공)
 * @param enabled 쿼리 활성화 여부
 */
export function useAvailableTimes(
  serviceId: number,
  date: string,
  type: TimeType,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['available-times', serviceId, date, type],
    queryFn: () => servicesApi.getAvailableTimes({ serviceId, date, type }),
    enabled: enabled && serviceId > 0 && !!date,
    staleTime: 60000, // 1분
  });
}
