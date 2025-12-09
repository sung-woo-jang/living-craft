/**
 * Living Craft 서비스 훅
 */

import { useQuery } from '@tanstack/react-query';

import * as servicesApi from '../api/services';

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
 */
export function useAvailableTimes(serviceId: string, date: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['available-times', serviceId, date],
    queryFn: () => servicesApi.getAvailableTimes({ serviceId, date }),
    enabled: enabled && !!serviceId && !!date,
    staleTime: 60000, // 1분
  });
}
