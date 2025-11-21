import { NavigationItem } from '@shared/types';

export const HEADER_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/' },
  { label: '서비스', path: '/services' },
  { label: '작업사례', path: '/portfolio' },
  { label: '고객후기', path: '/reviews' },
  { label: '자주묻는질문', path: '/faq' },
];

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { label: '홈', path: '/', iconName: 'icon-home-mono' },
  { label: '서비스', path: '/services', iconName: 'icon-diamond-mono' },
  { label: '예약', path: '/reservation', iconName: 'icon-shopping-bag-mono' },
  { label: '마이페이지', path: '/my', iconName: 'icon-graph-up-mono' },
];
