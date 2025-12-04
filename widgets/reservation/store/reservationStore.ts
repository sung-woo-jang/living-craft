import { TimeSlot } from '@shared/constants';
import { StoreWithShallow, useStoreWithShallow } from '@shared/model';
import { createWithEqualityFn } from 'zustand/traditional';

import { AddressSearchResult, DEFAULT_FORM_VALUES, ReservationFormData } from '../types';
import { generateRandomDisabledDates, generateRandomTimeSlots } from '../utils';

interface ReservationUIState {
  // 폼 데이터 (페이지 간 유지)
  formData: ReservationFormData;

  // UI 상태
  isLoading: boolean;
  isCalendarVisible: boolean;

  // 주소 검색 상태
  addressSearchQuery: string;
  addressSearchResults: AddressSearchResult[];
  isAddressSearching: boolean;
  showAddressDetailInput: boolean;
  selectedAddress: AddressSearchResult | null;

  // 유틸 데이터
  disabledDates: Date[];
  timeSlots: TimeSlot[];
}

interface ReservationUIActions {
  // 폼 데이터 관리
  updateFormData: (data: Partial<ReservationFormData>) => void;

  // UI 상태
  setIsLoading: (loading: boolean) => void;
  setIsCalendarVisible: (visible: boolean) => void;
  openCalendar: () => void;
  closeCalendar: () => void;

  // 주소 검색 상태
  setAddressSearchQuery: (query: string) => void;
  setAddressSearchResults: (results: AddressSearchResult[]) => void;
  setIsAddressSearching: (searching: boolean) => void;
  setShowAddressDetailInput: (show: boolean) => void;
  selectAddress: (address: AddressSearchResult) => void;
  resetAddressSearch: () => void;

  // 유틸 데이터
  updateTimeSlotsForDate: (date: string) => void;

  // 리셋
  reset: () => void;
}

type ReservationStore = ReservationUIState & ReservationUIActions;

const initialState: ReservationUIState = {
  formData: DEFAULT_FORM_VALUES,
  isLoading: false,
  isCalendarVisible: false,
  addressSearchQuery: '',
  addressSearchResults: [],
  isAddressSearching: false,
  showAddressDetailInput: false,
  selectedAddress: null,
  disabledDates: generateRandomDisabledDates(),
  timeSlots: [],
};

const reservationStore = createWithEqualityFn<ReservationStore>((set, get) => ({
  ...initialState,

  // 폼 데이터 관리
  updateFormData: (data) => {
    const { formData } = get();
    set({ formData: { ...formData, ...data } });
  },

  // UI 상태
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsCalendarVisible: (visible) => set({ isCalendarVisible: visible }),
  openCalendar: () => set({ isCalendarVisible: true }),
  closeCalendar: () => set({ isCalendarVisible: false }),

  // 주소 검색 상태
  setAddressSearchQuery: (query) => set({ addressSearchQuery: query }),
  setAddressSearchResults: (results) => set({ addressSearchResults: results }),
  setIsAddressSearching: (searching) => set({ isAddressSearching: searching }),
  setShowAddressDetailInput: (show) => set({ showAddressDetailInput: show }),
  selectAddress: (address) => set({ selectedAddress: address, showAddressDetailInput: true }),
  resetAddressSearch: () =>
    set({
      addressSearchQuery: '',
      addressSearchResults: [],
      isAddressSearching: false,
      showAddressDetailInput: false,
      selectedAddress: null,
    }),

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
 * const { formData, isLoading } = useReservationStore(['formData', 'isLoading']);
 */
export const useReservationStore: StoreWithShallow<ReservationStore> = (keys, withEqualityFn = true) =>
  useStoreWithShallow(reservationStore, keys, withEqualityFn);
