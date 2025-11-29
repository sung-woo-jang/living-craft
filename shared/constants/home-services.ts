export interface HomeService {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  buttonText: string;
  routePath: string;
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
  },
  {
    id: 'glass-cleaning',
    title: '유리청소',
    description: '전문 장비로 깨끗하게',
    icon: '✨',
    iconBgColor: '#E8F5E9',
    buttonText: '견적받기',
    routePath: '/reservation',
  },
];
