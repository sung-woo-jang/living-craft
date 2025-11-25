// 예약 관련 Mock 데이터
// pages/reservation/search.tsx, pages/my/reservations.tsx에서 사용

import { colors } from '@toss/tds-colors';

export interface ReservationDetail {
  id: string;
  reservationNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerName: string;
  customerPhone: string;
  address: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  canCancel: boolean;
  canReview: boolean;
}

export const STATUS_LABELS: Record<'pending' | 'confirmed' | 'completed' | 'cancelled', string> = {
  pending: '대기중',
  confirmed: '확정',
  completed: '완료',
  cancelled: '취소',
};

export const STATUS_COLORS: Record<'pending' | 'confirmed' | 'completed' | 'cancelled', string> = {
  pending: colors.orange500,
  confirmed: colors.blue500,
  completed: colors.green500,
  cancelled: colors.grey500,
};

// pages/reservation/search.tsx 용 (예약 조회)
export const SEARCH_MOCK_RESERVATIONS: Record<string, ReservationDetail> = {
  R20241210001: {
    id: '1',
    reservationNumber: 'R20241210001',
    serviceName: '아파트 전체 리모델링',
    date: '2024-12-20',
    time: '10:00',
    status: 'confirmed',
    customerName: '김철수',
    customerPhone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
  },
  R20241205002: {
    id: '2',
    reservationNumber: 'R20241205002',
    serviceName: '주방 리모델링',
    date: '2024-12-15',
    time: '14:00',
    status: 'pending',
    customerName: '이영희',
    customerPhone: '010-2345-6789',
    address: '서울시 서초구 반포대로 456',
  },
};

// pages/my/reservations.tsx 용 (내 예약)
export const MY_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    reservationNumber: 'R20241210001',
    serviceName: '아파트 전체 리모델링',
    date: '2024-12-20',
    time: '10:00',
    status: 'confirmed',
    canCancel: true,
    canReview: false,
  },
  {
    id: '2',
    reservationNumber: 'R20241205002',
    serviceName: '주방 리모델링',
    date: '2024-12-01',
    time: '14:00',
    status: 'completed',
    canCancel: false,
    canReview: true,
  },
];
