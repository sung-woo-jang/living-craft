export interface HomeService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconBgColor: string;
  buttonText: string;
  routePath: string;
  // 예약용 추가 필드
  duration?: string;
  /**
   * 시간 선택이 필요한 서비스인지 여부
   * - true: 특정 시간대 선택 필요 (기본값)
   * - false: 하루 종일 작업으로 시간 선택 불필요
   */
  requiresTimeSelection?: boolean;
}

export const HOME_SERVICES: HomeService[] = [
  {
    id: 'film',
    title: '인테리어 필름',
    description: '낡은 공간을 새것처럼 변화',
    iconName: 'icon-fill-color-mono',
    iconBgColor: '#E3F2FD',
    buttonText: '견적받기',
    routePath: '/reservation/service',
    duration: '하루 종일',
    requiresTimeSelection: false, // 하루 종일 작업
  },
  {
    id: 'glass-cleaning',
    title: '유리청소',
    description: '전문 장비로 깨끗하게',
    iconName: 'icon-front-twinkle-blue',
    iconBgColor: '#E8F5E9',
    buttonText: '견적받기',
    routePath: '/reservation/service',
    duration: '1-2시간',
    requiresTimeSelection: true, // 시간대 선택 필요
  },
];
