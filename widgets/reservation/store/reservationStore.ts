import { TimeSlot } from '@shared/constants';
import { StoreWithShallow, useStoreWithShallow } from '@shared/model';
import { createWithEqualityFn } from 'zustand/traditional';

import { checkAddressEstimateFee, getAvailableServiceIds, getServiceableRegions } from '../api';
import {
  AddressEstimateInfo,
  AddressSearchResult,
  AddressSelection,
  CityData,
  DEFAULT_FORM_VALUES,
  RegionData,
  ReservationFormData,
  ServiceableRegion,
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
  isAddressSearchDrawerOpen: boolean;

  // 지역 선택 상태
  addressSelection: AddressSelection;
  isRegionBottomSheetOpen: boolean;
  isCityBottomSheetOpen: boolean;
  regions: RegionData[];
  cities: CityData[];
  isLoadingRegions: boolean;
  isLoadingCities: boolean;

  // 서비스 가능 지역 상태
  serviceableRegions: ServiceableRegion[];
  isLoadingServiceableRegions: boolean;
  availableServiceIds: string[];

  // 견적 비용 상태
  addressEstimateInfo: AddressEstimateInfo | null;
  isCheckingEstimateFee: boolean;

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
  openAddressSearchDrawer: () => void;
  closeAddressSearchDrawer: () => void;

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

  // 서비스 가능 지역 액션
  loadServiceableRegions: () => Promise<void>;
  updateAvailableServices: () => void;
  getFilteredRegionsForService: (serviceId: string) => ServiceableRegion[];

  // 견적 비용 액션
  checkEstimateFee: (address: string, serviceId: string) => Promise<void>;
  resetEstimateFeeInfo: () => void;

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
  isAddressSearchDrawerOpen: false,
  addressSelection: { region: null, city: null },
  isRegionBottomSheetOpen: false,
  isCityBottomSheetOpen: false,
  regions: [],
  cities: [],
  isLoadingRegions: false,
  isLoadingCities: false,
  serviceableRegions: [],
  isLoadingServiceableRegions: false,
  availableServiceIds: [],
  addressEstimateInfo: null,
  isCheckingEstimateFee: false,
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
      isAddressSearchDrawerOpen: false,
      addressSelection: { region: null, city: null },
      cities: [],
    }),
  openAddressSearchDrawer: () => set({ isAddressSearchDrawerOpen: true }),
  closeAddressSearchDrawer: () => set({ isAddressSearchDrawerOpen: false }),

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
    // RegionSelectBottomSheet 먼저 닫기
    set({
      addressSelection: { region, city: null },
      isRegionBottomSheetOpen: false,
      isCityBottomSheetOpen: false, // 애니메이션 충돌 방지
      cities: [], // 이전 구/군 목록 초기화
    });

    // RegionSelectBottomSheet 닫기 애니메이션 완료 후 CitySelectBottomSheet 열기
    setTimeout(() => {
      set({ isCityBottomSheetOpen: true });
    }, 350); // 애니메이션 duration(250ms) + 여유(100ms)
  },

  selectCity: (city) => {
    const { addressSelection, serviceableRegions, formData } = get();

    // 선택된 지역에서 가능한 서비스 ID 목록 조회
    const availableIds = addressSelection.region
      ? getAvailableServiceIds(serviceableRegions, addressSelection.region.id, city.id)
      : [];

    // 현재 선택된 서비스가 새 지역에서도 가능한지 확인
    const currentService = formData.service;
    const shouldResetService = currentService && !availableIds.includes(currentService.id);

    set({
      addressSelection: { ...addressSelection, city },
      isCityBottomSheetOpen: false,
      availableServiceIds: availableIds,
      // 새 지역에서 불가능한 서비스면 초기화
      ...(shouldResetService && {
        formData: { ...formData, service: null },
      }),
    });
  },

  resetRegionSelection: () => {
    set({
      addressSelection: { region: null, city: null },
      isRegionBottomSheetOpen: false,
      isCityBottomSheetOpen: false,
      cities: [],
      availableServiceIds: [],
    });
  },

  // 서비스 가능 지역 액션
  loadServiceableRegions: async () => {
    set({ isLoadingServiceableRegions: true });
    try {
      const regions = await getServiceableRegions();
      set({
        serviceableRegions: regions,
        isLoadingServiceableRegions: false,
      });
    } catch {
      set({ isLoadingServiceableRegions: false });
    }
  },

  updateAvailableServices: () => {
    const { addressSelection, serviceableRegions, formData } = get();
    if (!addressSelection.region || !addressSelection.city) {
      set({ availableServiceIds: [] });
      return;
    }

    const availableIds = getAvailableServiceIds(
      serviceableRegions,
      addressSelection.region.id,
      addressSelection.city.id
    );

    // 현재 선택된 서비스가 새 지역에서도 가능한지 확인
    const currentService = formData.service;
    const shouldResetService = currentService && !availableIds.includes(currentService.id);

    set({
      availableServiceIds: availableIds,
      ...(shouldResetService && {
        formData: { ...formData, service: null },
      }),
    });
  },

  getFilteredRegionsForService: (serviceId) => {
    const { serviceableRegions } = get();
    if (!serviceId) return [];

    return serviceableRegions
      .map((region) => ({
        ...region,
        cities: region.cities.filter((city) => city.serviceIds.includes(serviceId)),
      }))
      .filter((region) => region.cities.length > 0);
  },

  // 견적 비용 액션
  checkEstimateFee: async (address, serviceId) => {
    set({ isCheckingEstimateFee: true });
    try {
      const estimateInfo = await checkAddressEstimateFee(address, serviceId);
      set({
        addressEstimateInfo: estimateInfo,
        isCheckingEstimateFee: false,
      });
    } catch {
      set({
        addressEstimateInfo: null,
        isCheckingEstimateFee: false,
      });
    }
  },

  resetEstimateFeeInfo: () => {
    set({
      addressEstimateInfo: null,
      isCheckingEstimateFee: false,
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
