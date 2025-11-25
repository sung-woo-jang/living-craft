// 리뷰 관련 Mock 데이터
// pages/reviews/index.tsx, pages/my/reviews.tsx, widgets/home/reviews-section에서 사용

export interface Review {
  id: string;
  serviceId: number;
  serviceName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface MyReview {
  id: string;
  serviceId: number;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface HomeReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  service: string;
}

// pages/reviews/index.tsx 용 (전체 리뷰 8개)
export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '김**',
    rating: 5,
    comment: '처음부터 끝까지 정말 만족스러웠습니다. 꼼꼼하고 친절하게 진행해주셔서 감사합니다.',
    date: '2024-12-10',
  },
  {
    id: '2',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '이**',
    rating: 5,
    comment: '기대 이상이었어요. 디자인 제안도 좋았고 시공 품질도 훌륭했습니다.',
    date: '2024-11-28',
  },
  {
    id: '3',
    serviceId: 2,
    serviceName: '주방 리모델링',
    userName: '최**',
    rating: 5,
    comment: '주방이 정말 깔끔하고 예뻐졌어요. 요리하는 게 즐거워졌습니다!',
    date: '2024-12-05',
  },
  {
    id: '4',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '박**',
    rating: 4,
    comment: '전반적으로 만족합니다. A/S도 빠르게 대응해주셨어요.',
    date: '2024-11-15',
  },
  {
    id: '5',
    serviceId: 3,
    serviceName: '욕실 리모델링',
    userName: '정**',
    rating: 4,
    comment: '욕실이 넓어 보이고 깨끗해졌어요. 방수 처리도 완벽합니다.',
    date: '2024-11-20',
  },
  {
    id: '6',
    serviceId: 4,
    serviceName: '베란다 확장',
    userName: '한**',
    rating: 5,
    comment: '공간이 훨씬 넓어져서 만족합니다. 단열도 잘 되어있어요.',
    date: '2024-10-30',
  },
  {
    id: '7',
    serviceId: 5,
    serviceName: '도배 / 장판',
    userName: '송**',
    rating: 3,
    comment: '깔끔하게 작업해주셨습니다. 다만 일정이 조금 지연되었어요.',
    date: '2024-10-18',
  },
  {
    id: '8',
    serviceId: 6,
    serviceName: '샤시 / 창호',
    userName: '윤**',
    rating: 5,
    comment: '소음이 확실히 줄어들었어요. 단열 효과도 좋습니다.',
    date: '2024-10-05',
  },
];

// pages/my/reviews.tsx 용 (내 리뷰 3개)
export const MOCK_MY_REVIEWS: MyReview[] = [
  {
    id: '1',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    rating: 5,
    comment: '처음부터 끝까지 정말 만족스러웠습니다. 꼼꼼하고 친절하게 진행해주셔서 감사합니다.',
    date: '2024-12-10',
  },
  {
    id: '2',
    serviceId: 2,
    serviceName: '주방 리모델링',
    rating: 5,
    comment: '주방이 정말 깔끔하고 예뻐졌어요. 요리하는 게 즐거워졌습니다!',
    date: '2024-12-05',
  },
  {
    id: '3',
    serviceId: 3,
    serviceName: '욕실 리모델링',
    rating: 4,
    comment: '욕실이 넓어 보이고 깨끗해졌어요. 방수 처리도 완벽합니다.',
    date: '2024-11-20',
  },
];

// widgets/home/reviews-section 용 (홈 리뷰 3개)
export const HOME_REVIEWS: HomeReview[] = [
  {
    id: '1',
    author: '김민수',
    rating: 5,
    content: '완벽한 인테리어 서비스였습니다. 디자이너님이 세심하게 신경써주셔서 만족스러운 결과를 얻었어요.',
    service: '홈 스타일링',
  },
  {
    id: '2',
    author: '이지은',
    rating: 5,
    content: '기대 이상이었습니다. 맞춤 가구가 공간에 딱 맞아서 너무 좋아요. 추천합니다!',
    service: '가구 제작',
  },
  {
    id: '3',
    author: '박준영',
    rating: 4,
    content: '오래된 사무실이 완전히 새롭게 바뀌었어요. 직원들 모두 만족하고 있습니다.',
    service: '리모델링',
  },
];
