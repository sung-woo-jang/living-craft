// 사용자 및 메뉴 관련 Mock 데이터
// pages/my/index.tsx에서 사용

export interface MenuItem {
  iconName: string;
  title: string;
  subtitle: string;
  path: string;
  badge?: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    iconName: 'icon-calendar-3-blue',
    title: '내 예약',
    subtitle: '예약 내역을 확인하세요',
    path: '/my/reservations',
    badge: 2,
  },
  {
    iconName: 'icon-star-mono',
    title: '내 리뷰',
    subtitle: '작성한 리뷰를 확인하세요',
    path: '/my/reviews',
    badge: 3,
  },
  {
    iconName: 'icon-setting-reddot',
    title: '설정',
    subtitle: '앱 설정 및 정보',
    path: '/my/settings',
  },
];

export const MOCK_USER: User = {
  name: '홍길동',
  email: 'hong@example.com',
  phone: '010-1234-5678',
};
