import type { Service, ServiceRegion } from '@shared/api/types';

import type { AddressEstimateInfo } from '../types';

/**
 * 서비스 목록 Mock 데이터 (Backend API 구조)
 * TODO: 백엔드 API 연동 시 GET /api/services로 교체
 */
const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: '인테리어 필름',
    description: '싱크대, 가구, 문틀 등에 필름 시공',
    icon: { id: 1, name: 'icon-fill-color-mono', type: 'MONO' },
    iconBgColor: '#E3F2FD',
    duration: '하루 종일',
    requiresTimeSelection: false,
    isActive: true,
    sortOrder: 1,
    serviceRegions: [
      {
        id: 'incheon',
        name: '인천광역시',
        estimateFee: 0,
        cities: [
          { id: 'jung-gu', name: '중구', estimateFee: null },
          { id: 'dong-gu', name: '동구', estimateFee: null },
          { id: 'michuhol-gu', name: '미추홀구', estimateFee: null },
          { id: 'yeonsu-gu', name: '연수구', estimateFee: null },
          { id: 'namdong-gu', name: '남동구', estimateFee: null },
          { id: 'bupyeong-gu', name: '부평구', estimateFee: null },
          { id: 'gyeyang-gu', name: '계양구', estimateFee: null },
          { id: 'seo-gu', name: '서구', estimateFee: null },
          { id: 'ganghwa-gun', name: '강화군', estimateFee: 30000 }, // 도서지역 추가비용
          { id: 'ongjin-gun', name: '옹진군', estimateFee: 30000 }, // 도서지역 추가비용
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: '유리 청소',
    description: '외벽, 베란다, 창문 유리 전문 청소',
    icon: { id: 2, name: 'icon-sparkle-mono', type: 'MONO' },
    iconBgColor: '#E8F5E9',
    duration: '1-2시간',
    requiresTimeSelection: true,
    isActive: true,
    sortOrder: 2,
    serviceRegions: [
      {
        id: 'incheon',
        name: '인천광역시',
        estimateFee: 0,
        cities: [
          { id: 'jung-gu', name: '중구', estimateFee: null },
          { id: 'dong-gu', name: '동구', estimateFee: null },
          { id: 'michuhol-gu', name: '미추홀구', estimateFee: null },
          { id: 'yeonsu-gu', name: '연수구', estimateFee: null },
          { id: 'namdong-gu', name: '남동구', estimateFee: null },
          { id: 'bupyeong-gu', name: '부평구', estimateFee: null },
          { id: 'gyeyang-gu', name: '계양구', estimateFee: null },
          { id: 'seo-gu', name: '서구', estimateFee: null },
          // 강화군, 옹진군은 유리청소 불가 (제외)
        ],
      },
      {
        id: 'seoul',
        name: '서울특별시',
        estimateFee: 0,
        cities: [
          { id: 'gangnam-gu', name: '강남구', estimateFee: null },
          { id: 'gangdong-gu', name: '강동구', estimateFee: null },
          { id: 'gangbuk-gu', name: '강북구', estimateFee: null },
          { id: 'gangseo-gu', name: '강서구', estimateFee: null },
          { id: 'gwanak-gu', name: '관악구', estimateFee: null },
          { id: 'gwangjin-gu', name: '광진구', estimateFee: null },
          { id: 'guro-gu', name: '구로구', estimateFee: null },
          { id: 'geumcheon-gu', name: '금천구', estimateFee: null },
          { id: 'nowon-gu', name: '노원구', estimateFee: null },
          { id: 'dobong-gu', name: '도봉구', estimateFee: null },
          { id: 'dongdaemun-gu', name: '동대문구', estimateFee: null },
          { id: 'dongjak-gu', name: '동작구', estimateFee: null },
          { id: 'mapo-gu', name: '마포구', estimateFee: null },
          { id: 'seodaemun-gu', name: '서대문구', estimateFee: null },
          { id: 'seocho-gu', name: '서초구', estimateFee: null },
          { id: 'seongdong-gu', name: '성동구', estimateFee: null },
          { id: 'seongbuk-gu', name: '성북구', estimateFee: null },
          { id: 'songpa-gu', name: '송파구', estimateFee: null },
          { id: 'yangcheon-gu', name: '양천구', estimateFee: null },
          { id: 'yeongdeungpo-gu', name: '영등포구', estimateFee: null },
          { id: 'yongsan-gu', name: '용산구', estimateFee: null },
          { id: 'eunpyeong-gu', name: '은평구', estimateFee: null },
          { id: 'jongno-gu', name: '종로구', estimateFee: null },
          { id: 'jung-gu-seoul', name: '중구', estimateFee: null },
          { id: 'jungnang-gu', name: '중랑구', estimateFee: null },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * 서비스 목록 조회 (Backend API와 동일한 구조)
 * TODO: 백엔드 API 연동 시 GET /api/services로 교체
 * @returns 서비스 목록
 */
export async function getServices(): Promise<Service[]> {
  // Mock 응답 (실제 API 연동 전)
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SERVICES), 300);
  });

  // 실제 API 연동 예시:
  // const response = await fetch('/api/services');
  // if (!response.ok) {
  //   throw new Error('Failed to fetch services');
  // }
  // const result: SuccessResponse<Service[]> = await response.json();
  // return result.data;
}

/**
 * 특정 서비스에서 가능한 지역 목록 조회
 * @param services - 전체 서비스 목록
 * @param serviceId - 서비스 ID
 * @returns 해당 서비스의 지역 목록
 */
export function getServiceableRegionsForService(
  services: Service[],
  serviceId: number
): ServiceRegion[] {
  const service = services.find((s) => s.id === serviceId);
  return service?.serviceRegions ?? [];
}

/**
 * 주소 기반 견적 비용 조회
 * 선택된 지역/도시의 estimateFee를 기반으로 비용 계산
 * TODO: 백엔드 API 연동 시 실제 엔드포인트로 교체
 * @param serviceId - 서비스 ID
 * @param regionId - 시/도 ID
 * @param cityId - 시/군/구 ID
 * @returns 견적 비용 정보
 */
export async function checkEstimateFeeByRegion(
  serviceId: number,
  regionId: string,
  cityId: string
): Promise<AddressEstimateInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const service = MOCK_SERVICES.find((s) => s.id === serviceId);
      if (!service) {
        resolve({ hasEstimateFee: false });
        return;
      }

      const region = service.serviceRegions?.find((r: ServiceRegion) => r.id === regionId);
      if (!region) {
        resolve({ hasEstimateFee: false });
        return;
      }

      const city = region.cities.find((c: { id: string; name: string; estimateFee: number | null }) => c.id === cityId);
      if (!city) {
        resolve({ hasEstimateFee: false });
        return;
      }

      // 도시의 estimateFee가 있으면 그것 사용, 없으면 지역 기본 비용 사용
      const fee = city.estimateFee ?? region.estimateFee;

      if (fee > 0) {
        resolve({
          hasEstimateFee: true,
          estimateFee: fee,
          estimateFeeReason:
            city.estimateFee !== null && city.estimateFee > 0
              ? '해당 지역 추가 출장비'
              : '지역 기본 출장비',
        });
      } else {
        resolve({ hasEstimateFee: false });
      }
    }, 200);
  });

  // 실제 API 연동 예시:
  // const response = await fetch(
  //   `/api/estimate-fee?serviceId=${serviceId}&regionId=${regionId}&cityId=${cityId}`
  // );
  // if (!response.ok) {
  //   throw new Error('Failed to check estimate fee');
  // }
  // const result: SuccessResponse<AddressEstimateInfo> = await response.json();
  // return result.data;
}
