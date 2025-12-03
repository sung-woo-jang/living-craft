import { NavigationItem } from '@shared/types';

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/', iconName: 'icon-home-blue' },
  { label: '포트폴리오', path: '/portfolio', iconName: 'icon-briefcase' },
  { label: '견적받기', path: '/reservation/service', iconName: 'icon-document-won-blue' },
  { label: '마이페이지', path: '/my', iconName: 'icon-person-default-man' },
];

/**
 * 탭바 설정 인터페이스
 */
export interface TabBarConfig {
  isFloat: boolean; // true: 플로팅 탭바, false: 하단 고정 탭바
  isVisible: boolean; // true: 표시, false: 숨김
}

/**
 * 경로별 탭바 설정
 */
export const ROUTE_TAB_CONFIG: Record<string, TabBarConfig> = {
  '/': { isFloat: true, isVisible: true }, // 홈: 플로팅
  '/portfolio': { isFloat: false, isVisible: true }, // 포트폴리오: 고정
  '/reservation/service': { isFloat: true, isVisible: false }, // 예약 - 서비스 선택: 숨김
  '/reservation/datetime': { isFloat: true, isVisible: false }, // 예약 - 날짜/시간: 숨김
  '/reservation/customer': { isFloat: true, isVisible: false }, // 예약 - 고객 정보: 숨김
  '/reservation/confirmation': { isFloat: true, isVisible: false }, // 예약 - 확인: 숨김
  '/reviews': { isFloat: true, isVisible: true }, // 리뷰: 플로팅
  '/my': { isFloat: false, isVisible: true }, // 마이페이지: 고정
};
