import { NavigationItem } from '@shared/types';

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/', iconName: 'icon-home-red-white' },
  { label: '포트폴리오', path: '/portfolio', iconName: 'icon-briefcase-mono' },
  { label: '예약', path: '/reservation', iconName: 'icon-calendar-3-blue' },
  { label: '마이페이지', path: '/my', iconName: 'icon-account-info-blue' },
];

/**
 * 탭바 설정 인터페이스
 */
export interface TabBarConfig {
  isFloat: boolean;   // true: 플로팅 탭바, false: 하단 고정 탭바
  isVisible: boolean; // true: 표시, false: 숨김
}

/**
 * 경로별 탭바 설정
 */
export const ROUTE_TAB_CONFIG: Record<string, TabBarConfig> = {
  '/': { isFloat: true, isVisible: true },           // 홈: 플로팅
  '/portfolio': { isFloat: false, isVisible: true }, // 포트폴리오: 고정
  '/reservation': { isFloat: true, isVisible: false }, // 예약: 숨김
  '/reviews': { isFloat: true, isVisible: true },    // 리뷰: 플로팅
  '/my': { isFloat: false, isVisible: true },        // 마이페이지: 고정
};
