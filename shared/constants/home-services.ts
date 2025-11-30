export interface HomeService {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  buttonText: string;
  routePath: string;
  // 예약용 추가 필드
  price?: number;
  duration?: string;
  features?: string[];
}

export const HOME_SERVICES: HomeService[] = [
  {
    id: 'film',
    title: '인테리어 필름',
    description: '낡은 공간을 새것처럼 변화',
    icon: '🎨',
    iconBgColor: '#E3F2FD',
    buttonText: '견적받기',
    routePath: '/reservation',
    price: 120000,
    duration: '2-3시간',
    features: ['현장 측정', '필름 시공', '마감 처리'],
  },
  {
    id: 'glass-cleaning',
    title: '유리청소',
    description: '전문 장비로 깨끗하게',
    icon: '✨',
    iconBgColor: '#E8F5E9',
    buttonText: '견적받기',
    routePath: '/reservation',
    price: 80000,
    duration: '1-2시간',
    features: ['외부 유리', '내부 유리', '창틀 청소'],
  },
];
