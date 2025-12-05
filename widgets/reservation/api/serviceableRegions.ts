import type { ServiceableRegion } from '../types';

/**
 * 서비스 가능 지역 Mock 데이터
 * 현재는 인천광역시만 서비스 가능
 * TODO: 백엔드 API 연동 시 실제 엔드포인트로 교체
 */
const MOCK_SERVICEABLE_REGIONS: ServiceableRegion[] = [
  {
    id: 'incheon',
    name: '인천광역시',
    cities: [
      { id: 'jung-gu', name: '중구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'dong-gu', name: '동구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'michuhol-gu', name: '미추홀구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'yeonsu-gu', name: '연수구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'namdong-gu', name: '남동구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'bupyeong-gu', name: '부평구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'gyeyang-gu', name: '계양구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'seo-gu', name: '서구', regionId: 'incheon', serviceIds: ['film', 'glass-cleaning'] },
      { id: 'ganghwa-gun', name: '강화군', regionId: 'incheon', serviceIds: ['film'] }, // 유리청소는 불가
      { id: 'ongjin-gun', name: '옹진군', regionId: 'incheon', serviceIds: ['film'] }, // 유리청소는 불가
    ],
  },
];

/**
 * 서비스 가능 지역 목록 조회
 * 서비스별 가용성 정보가 포함된 지역 목록을 반환
 * TODO: 백엔드 API 연동 시 실제 엔드포인트로 교체
 * @returns 서비스 가능 지역 목록
 */
export async function getServiceableRegions(): Promise<ServiceableRegion[]> {
  // Mock 응답 (실제 API 연동 전)
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SERVICEABLE_REGIONS), 300);
  });

  // 실제 API 연동 예시:
  // const response = await fetch('/api/serviceable-regions');
  // if (!response.ok) {
  //   throw new Error('Failed to fetch serviceable regions');
  // }
  // return response.json();
}

/**
 * 특정 지역에서 가능한 서비스 ID 목록 조회
 * @param regionId 시/도 ID
 * @param cityId 구/군 ID
 * @returns 서비스 ID 목록
 */
export function getAvailableServiceIds(
  regions: ServiceableRegion[],
  regionId: string,
  cityId: string
): string[] {
  const region = regions.find((r) => r.id === regionId);
  if (!region) return [];

  const city = region.cities.find((c) => c.id === cityId);
  if (!city) return [];

  return city.serviceIds;
}
