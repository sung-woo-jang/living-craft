import { NavigationItem } from '@shared/types';

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/', iconName: 'icon-home-blue' },
  { label: '포트폴리오', path: '/portfolio', iconName: 'icon-briefcase' },
  { label: '견적받기', path: '/reservation', iconName: 'icon-document-won-blue' },
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
  '/reservation': { isVisible: false }, // 예약: 숨김
  '/reviews': { isVisible: true }, // 리뷰
  '/my': { isVisible: true }, // 마이페이지
};

/**
 * 플로팅 탭바 높이 상수
 * Apps-in-Toss 가이드라인: 플로팅 형태의 탭바 사용 시 콘텐츠 하단 여백
 *
 * 탭바 내부 높이 계산:
 * - paddingTop: 9px
 * - paddingBottom: 8px
 * - navItem paddingVertical: 16px (8px × 2)
 * - 아이콘: 24px
 * - 텍스트 lineHeight: 16.5px
 * - 아이콘-텍스트 간격: 1px
 * = 총 내부 높이: ~74.5px
 *
 * + Safe Area Insets bottom: 최소 8px (기기마다 다름)
 * + 여유 공간: 15.5px
 * = 안전한 여백: 100px
 */
export const TAB_BAR_HEIGHT = 130;
