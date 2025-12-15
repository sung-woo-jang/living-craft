import { ImageResponse } from '@apps-in-toss/framework';
import { Service, TimeSlotDto } from '@shared/api/types';

export interface ImageState extends ImageResponse {
  previewUri: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  memo: string;
  photos: ImageState[];
}

/**
 * 예약 폼 데이터
 *
 * 고객은 견적 문의 날짜/시간만 선택합니다.
 * 시공 일정은 견적 방문 후 관리자가 백오피스에서 지정합니다.
 */
export interface ReservationFormData {
  service: Service | null;
  // 견적 희망 날짜/시간
  estimateDate: string;
  estimateTimeSlot: TimeSlotDto | null;
  customerInfo: CustomerInfo;
  agreedToTerms: boolean;
}

export type StepKey = 'service' | 'datetime' | 'customer' | 'confirmation';

export const STEP_ORDER: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];

// 네이버 지역 검색 API 응답 타입
export interface NaverLocalSearchItem {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  mapx: string;
  mapy: string;
}

// 카카오 키워드 검색 API 응답 타입
export interface KakaoDocument {
  place_name: string; // 장소명
  address_name: string; // 지번 주소
  road_address_name: string; // 도로명 주소
  x: string; // 경도
  y: string; // 위도
  category_name: string; // 카테고리
  phone: string; // 전화번호
}

export interface KakaoKeywordSearchResponse {
  documents: KakaoDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

// 주소 검색 결과 아이템 (UI용)
export interface AddressSearchResult {
  roadAddress: string; // 도로명 주소
  jibunAddress: string; // 지번 주소
  zipCode: string; // 우편번호
}

// 시/도 정보
export interface RegionData {
  id: string; // 예: "incheon"
  name: string; // 예: "인천광역시"
  code?: string; // 행정구역 코드 (선택사항)
}

// 구/군 정보
export interface CityData {
  id: string; // 예: "namdong-gu"
  name: string; // 예: "남동구"
  regionId: string; // 상위 시/도 ID
  code?: string; // 행정구역 코드 (선택사항)
}

// 주소 선택 상태
export interface AddressSelection {
  region: RegionData | null;
  city: CityData | null;
}

// 서비스 가능 구/군 정보 (Backend API ServiceCity와 동일)
export interface ServiceableCity {
  id: string;
  name: string;
  estimateFee: number | null; // null이면 지역 기본 비용 적용
}

// 서비스 가능 시/도 정보 (Backend API ServiceRegion과 동일)
export interface ServiceableRegion {
  id: string;
  name: string;
  estimateFee: number; // 해당 지역 기본 출장 비용
  cities: ServiceableCity[];
}

// 주소 견적 비용 조회 결과
export interface AddressEstimateInfo {
  hasEstimateFee: boolean; // 견적 비용 발생 여부
  estimateFee?: number; // 견적 비용 (원)
  estimateFeeReason?: string; // 비용 사유 (예: "도서지역 추가비용")
}

export const DEFAULT_FORM_VALUES: ReservationFormData = {
  service: null,
  estimateDate: '',
  estimateTimeSlot: null,
  customerInfo: {
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    memo: '',
    photos: [],
  },
  agreedToTerms: false,
};
