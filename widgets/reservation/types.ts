import { ImageResponse } from '@apps-in-toss/framework';
import { TimeSlot } from '@shared/constants';
import { HomeService } from '@shared/constants/home-services';

export interface ImageState extends ImageResponse {
  previewUri: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  requirements: string;
  photos: ImageState[];
}

export interface ReservationFormData {
  service: HomeService | null;
  date: string;
  timeSlot: TimeSlot | null;
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

export const DEFAULT_FORM_VALUES: ReservationFormData = {
  service: null,
  date: '',
  timeSlot: null,
  customerInfo: {
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    requirements: '',
    photos: [],
  },
  agreedToTerms: false,
};
