import { TimeSlot } from '@shared/constants';
import { StoreWithShallow, useStoreWithShallow } from '@shared/model';
import { createWithEqualityFn } from 'zustand/traditional';

import { StepKey } from '../types';
import { generateRandomDisabledDates, generateRandomTimeSlots } from '../utils';

interface ReservationUIState {
  // Step 관리
  currentStep: StepKey;

  // UI 상태
  isLoading: boolean;
  isCalendarVisible: boolean;

  // 유틸 데이터
  disabledDates: Date[];
  timeSlots: TimeSlot[];
}

interface ReservationUIActions {
  // Step 관리
  setCurrentStep: (step: StepKey) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // UI 상태
  setIsLoading: (loading: boolean) => void;
  setIsCalendarVisible: (visible: boolean) => void;
  openCalendar: () => void;
  closeCalendar: () => void;

  // 유틸 데이터
  updateTimeSlotsForDate: (date: string) => void;

  // 리셋
  reset: () => void;
}

type ReservationStore = ReservationUIState & ReservationUIActions;

const STEP_ORDER: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];

const initialState: ReservationUIState = {
  currentStep: 'service',
  isLoading: false,
  isCalendarVisible: false,
  disabledDates: generateRandomDisabledDates(),
  timeSlots: [],
};

const reservationStore = createWithEqualityFn<ReservationStore>((set, get) => ({
  ...initialState,

  // Step 관리
  setCurrentStep: (step) => set({ currentStep: step }),

  goToNextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      if (prevStep) {
        set({ currentStep: prevStep });
      }
    }
  },

  // UI 상태
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsCalendarVisible: (visible) => set({ isCalendarVisible: visible }),
  openCalendar: () => set({ isCalendarVisible: true }),
  closeCalendar: () => set({ isCalendarVisible: false }),

  // 유틸 데이터
  updateTimeSlotsForDate: (date) => {
    if (!date) {
      set({ timeSlots: [] });
      return;
    }
    set({ timeSlots: generateRandomTimeSlots(date) });
  },

  // 리셋
  reset: () => set({ ...initialState, disabledDates: generateRandomDisabledDates() }),
}));

/**
 * 예약 UI 상태를 선택적으로 구독하는 훅
 * @example
 * const { currentStep, isLoading } = useReservationStore(['currentStep', 'isLoading']);
 */
export const useReservationStore: StoreWithShallow<ReservationStore> = (keys, withEqualityFn = true) =>
  useStoreWithShallow(reservationStore, keys, withEqualityFn);
