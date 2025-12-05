import { TimeSlot } from '@shared/constants';
import { StoreWithShallow, useStoreWithShallow } from '@shared/model';
import { createWithEqualityFn } from 'zustand/traditional';

import {
  AddressSearchResult,
  AddressSelection,
  CityData,
  DEFAULT_FORM_VALUES,
  RegionData,
  ReservationFormData,
} from '../types';
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

  // 지역 선택 상태 (새로 추가)
  addressSelection: AddressSelection;
  isRegionBottomSheetOpen: boolean;
  isCityBottomSheetOpen: boolean;
  regions: RegionData[];
  cities: CityData[];
  isLoadingRegions: boolean;
  isLoadingCities: boolean;

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

  // 지역 선택 액션 (새로 추가)
  setAddressSelection: (selection: Partial<AddressSelection>) => void;
  setIsRegionBottomSheetOpen: (open: boolean) => void;
  setIsCityBottomSheetOpen: (open: boolean) => void;
  setRegions: (regions: RegionData[]) => void;
  setCities: (cities: CityData[]) => void;
  setIsLoadingRegions: (loading: boolean) => void;
  setIsLoadingCities: (loading: boolean) => void;
  selectRegion: (region: RegionData) => void;
  selectCity: (city: CityData) => void;
  resetRegionSelection: () => void;

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
  addressSelection: { region: null, city: null },
  isRegionBottomSheetOpen: false,
  isCityBottomSheetOpen: false,
  regions: [],
  cities: [],
  isLoadingRegions: false,
  isLoadingCities: false,
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
      addressSelection: { region: null, city: null },
      cities: [],
    }),

  // 지역 선택 액션
  setAddressSelection: (selection) => {
    const { addressSelection } = get();
    set({ addressSelection: { ...addressSelection, ...selection } });
  },
  setIsRegionBottomSheetOpen: (open) => set({ isRegionBottomSheetOpen: open }),
  setIsCityBottomSheetOpen: (open) => set({ isCityBottomSheetOpen: open }),
  setRegions: (regions) => set({ regions }),
  setCities: (cities) => set({ cities }),
  setIsLoadingRegions: (loading) => set({ isLoadingRegions: loading }),
  setIsLoadingCities: (loading) => set({ isLoadingCities: loading }),

  selectRegion: (region) => {
    set({
      addressSelection: { region, city: null },
      isRegionBottomSheetOpen: false,
      isCityBottomSheetOpen: true,
      cities: [], // 이전 구/군 목록 초기화
    });
  },

  selectCity: (city) => {
    const { addressSelection } = get();
    set({
      addressSelection: { ...addressSelection, city },
      isCityBottomSheetOpen: false,
    });
  },

  resetRegionSelection: () => {
    set({
      addressSelection: { region: null, city: null },
      isRegionBottomSheetOpen: false,
      isCityBottomSheetOpen: false,
      cities: [],
    });
  },

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
