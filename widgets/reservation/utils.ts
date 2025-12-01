import { ALL_TIME_SLOTS, TimeSlot } from '@shared/constants';

/**
 * 랜덤하게 예약 불가능한 날짜를 생성합니다.
 */
export function generateRandomDisabledDates(): Date[] {
  const disabledDates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledCount = Math.floor(Math.random() * 5) + 8;
  const disabledDayIndices = new Set<number>();

  while (disabledDayIndices.size < disabledCount) {
    const randomDay = Math.floor(Math.random() * 30) + 1;
    disabledDayIndices.add(randomDay);
  }

  disabledDayIndices.forEach((dayOffset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    disabledDates.push(date);
  });

  return disabledDates;
}

/**
 * 날짜별 시간 슬롯 가용성을 랜덤하게 생성합니다.
 */
export function generateRandomTimeSlots(dateString: string): TimeSlot[] {
  let seedValue = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  return ALL_TIME_SLOTS.map((slot) => ({
    ...slot,
    available: seededRandom() > 0.3,
  }));
}
