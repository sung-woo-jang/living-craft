// 서비스 관련 Mock 데이터
// pages/reservation/index.tsx, widgets/home/services-section에서 사용

export interface Service {
  id: string;
  name: string;
  type: 'fixed';
  icon: string;
  description: string;
  features: string[];
  price?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// pages/reservation/index.tsx 용 (예약 가능 서비스)
export const RESERVATION_SERVICES: Service[] = [
  {
    id: 'styling-fixed',
    name: '홈 스타일링',
    type: 'fixed',
    icon: '🏡',
    description: '전문 디자이너가 제안하는 맞춤형 인테리어',
    features: ['현장 방문', '디자인 제안', '가구 배치', '3-4시간 소요'],
    price: 150000,
  },
  {
    id: 'film-fixed',
    name: '인테리어 필름',
    type: 'fixed',
    icon: '🎨',
    description: '벽지·가구·문틀 필름으로 새 집처럼',
    features: ['현장 측정', '필름 작업', '마감 처리', '2-3시간 소요'],
    price: 120000,
  },
  {
    id: 'repair-fixed',
    name: '집수리 종합 서비스',
    type: 'fixed',
    icon: '🔧',
    description: '누수, 균열, 문짝 등 집안 전반 수리',
    features: ['문제 진단', '수리 작업', '마감 점검', '1-2시간 소요'],
    price: 80000,
  },
  {
    id: 'wallpaper-fixed',
    name: '도배·장판',
    type: 'fixed',
    icon: '🖼️',
    description: '새 도배와 장판으로 깔끔한 공간 연출',
    features: ['자재 상담', '도배·장판 작업', '청소', '4-5시간 소요'],
    price: 200000,
  },
];

// widgets/home/services-section 용 (홈 페이지 주요 서비스)
export const FEATURED_SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: '홈 스타일링',
    description: '전문 디자이너가 제안하는 맞춤형 인테리어',
    icon: '🏡',
  },
  {
    id: '2',
    title: '인테리어 필름',
    description: '벽지·가구·문틀 필름으로 새 집처럼',
    icon: '🎨',
  },
  {
    id: '3',
    title: '집수리 종합 서비스',
    description: '누수, 균열, 문짝 등 집안 전반 수리',
    icon: '🔧',
  },
  {
    id: '4',
    title: '도배·장판',
    description: '새 도배와 장판으로 깔끔한 공간 연출',
    icon: '🖼️',
  },
];

// pages/reservation/index.tsx 용 (예약 시간 슬롯)
export const ALL_TIME_SLOTS: TimeSlot[] = [
  { id: '09:00', time: '09:00', available: true },
  { id: '10:00', time: '10:00', available: true },
  { id: '11:00', time: '11:00', available: true },
  { id: '13:00', time: '13:00', available: true },
  { id: '14:00', time: '14:00', available: true },
  { id: '15:00', time: '15:00', available: true },
  { id: '16:00', time: '16:00', available: true },
  { id: '17:00', time: '17:00', available: true },
];
