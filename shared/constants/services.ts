export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

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
  { id: '18:00', time: '18:00', available: true },
  { id: '19:00', time: '19:00', available: true },
  { id: '20:00', time: '20:00', available: true },
  { id: '21:00', time: '21:00', available: true },
  { id: '22:00', time: '22:00', available: true },
  { id: '23:00', time: '23:00', available: true },
];
