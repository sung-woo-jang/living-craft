import { NavigationItem } from '@shared/types';

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/', iconName: 'icon-home-blue' },
  { label: '포트폴리오', path: '/portfolio', iconName: 'icon-briefcase' },
  { label: '견적받기', path: '/reservation/service', iconName: 'icon-document-won-blue' },
  { label: '마이페이지', path: '/my', iconName: 'icon-person-default-man' },
];

/**
 * 탭바 설정 인터페이스
 * Apps-in-Toss 가이드라인: 항상 플로팅 형태만 사용
 */
export interface TabBarConfig {
  isVisible: boolean; // true: 표시, false: 숨김
}

/**
 * 경로별 탭바 설정
 * 모든 탭바는 플로팅 형태로 표시됨 (Apps-in-Toss 가이드라인 준수)
 */
export const ROUTE_TAB_CONFIG: Record<string, TabBarConfig> = {
  '/': { isVisible: true }, // 홈
  '/portfolio': { isVisible: true }, // 포트폴리오
  '/reservation/service': { isVisible: false }, // 예약 - 서비스 선택: 숨김
  '/reservation/datetime': { isVisible: false }, // 예약 - 날짜/시간: 숨김
  '/reservation/customer': { isVisible: false }, // 예약 - 고객 정보: 숨김
  '/reservation/confirmation': { isVisible: false }, // 예약 - 확인: 숨김
  '/reviews': { isVisible: true }, // 리뷰
  '/my': { isVisible: true }, // 마이페이지
};
