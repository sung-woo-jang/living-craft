import type { AddressEstimateInfo, ServiceableRegion } from '../types';

/**
 * 서비스 가능 지역 Mock 데이터
 * - 인천: 필름 + 유리청소 (일부 지역 유리청소 불가)
 * - 서울: 유리청소만 가능
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
  {
    id: 'seoul',
    name: '서울특별시',
    cities: [
      // 서울은 유리청소만 가능
      { id: 'gangnam-gu', name: '강남구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'gangdong-gu', name: '강동구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'gangbuk-gu', name: '강북구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'gangseo-gu', name: '강서구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'gwanak-gu', name: '관악구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'gwangjin-gu', name: '광진구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'guro-gu', name: '구로구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'geumcheon-gu', name: '금천구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'nowon-gu', name: '노원구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'dobong-gu', name: '도봉구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'dongdaemun-gu', name: '동대문구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'dongjak-gu', name: '동작구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'mapo-gu', name: '마포구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'seodaemun-gu', name: '서대문구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'seocho-gu', name: '서초구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'seongdong-gu', name: '성동구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'seongbuk-gu', name: '성북구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'songpa-gu', name: '송파구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'yangcheon-gu', name: '양천구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'yeongdeungpo-gu', name: '영등포구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'yongsan-gu', name: '용산구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'eunpyeong-gu', name: '은평구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'jongno-gu', name: '종로구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'jung-gu-seoul', name: '중구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
      { id: 'jungnang-gu', name: '중랑구', regionId: 'seoul', serviceIds: ['glass-cleaning'] },
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

/**
 * 주소 기반 견적 비용 조회
 * 도서/원거리 지역의 경우 견적 비용이 발생할 수 있음
 * TODO: 백엔드 API 연동 시 실제 엔드포인트로 교체
 * @param address 도로명 주소
 * @param _serviceId 서비스 ID (향후 서비스별 차등 비용 적용 가능)
 * @returns 견적 비용 정보
 */
export async function checkAddressEstimateFee(
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- 향후 서비스별 차등 비용 적용 가능
  _serviceId: string
): Promise<AddressEstimateInfo> {
  // Mock: 주소에 "영종" 또는 "강화" 포함 시 견적 비용 발생
  return new Promise((resolve) => {
    setTimeout(() => {
      const isRemoteArea = address.includes('영종') || address.includes('강화');

      if (isRemoteArea) {
        resolve({
          hasEstimateFee: true,
          estimateFee: 30000,
          estimateFeeReason: '도서/원거리 지역 추가비용',
        });
      } else {
        resolve({ hasEstimateFee: false });
      }
    }, 200);
  });

  // 실제 API 연동 예시:
  // const response = await fetch(`/api/estimate-fee?address=${encodeURIComponent(address)}&serviceId=${serviceId}`);
  // if (!response.ok) {
  //   throw new Error('Failed to check estimate fee');
  // }
  // return response.json();
}
