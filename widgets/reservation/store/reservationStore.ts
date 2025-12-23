import { getServices } from '@shared/api/services';
import { Service } from '@shared/api/types';
import { StoreWithShallow, useStoreWithShallow } from '@shared/model';
import {
  AccordionStepsState,
  getNextStep,
  initialAccordionSteps,
  STEP_ORDER,
  StepKey,
  StepStatus,
} from '@shared/ui/accordion-step';
import { createWithEqualityFn } from 'zustand/traditional';

import { checkEstimateFeeByRegion, getServiceableRegionsForService } from '../api';
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

interface ReservationUIState {
  // 폼 데이터 (페이지 간 유지)
  formData: ReservationFormData;

  // UI 상태
  isLoading: boolean;
  // 견적 캘린더
  isEstimateCalendarVisible: boolean;

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

  // 서비스 목록 (각 서비스가 가능 지역 포함)
  services: Service[];
  isLoadingServices: boolean;

  // 견적 비용 상태
  addressEstimateInfo: AddressEstimateInfo | null;
  isCheckingEstimateFee: boolean;

  // Accordion 상태 (통합 예약 페이지용)
  accordionSteps: AccordionStepsState;
}

interface ReservationUIActions {
  // 폼 데이터 관리
  updateFormData: (data: Partial<ReservationFormData>) => void;

  // UI 상태
  setIsLoading: (loading: boolean) => void;
  // 견적 캘린더
  openEstimateCalendar: () => void;
  closeEstimateCalendar: () => void;

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

  // 서비스 목록 액션
  loadServices: () => Promise<void>;
  getFilteredRegionsForService: (serviceId: number) => ServiceableRegion[];

  // 견적 비용 액션
  checkEstimateFee: () => void;
  resetEstimateFeeInfo: () => void;

  // Accordion 액션 (통합 예약 페이지용)
  setStepStatus: (step: StepKey, status: StepStatus) => void;
  setStepExpanded: (step: StepKey, isExpanded: boolean) => void;
  toggleStepExpanded: (step: StepKey) => void;
  completeStep: (step: StepKey) => void;
  goToStep: (step: StepKey) => void;
  resetAccordionSteps: () => void;

  // 리셋
  reset: () => void;
}

type ReservationStore = ReservationUIState & ReservationUIActions;

const initialState: ReservationUIState = {
  formData: DEFAULT_FORM_VALUES,
  isLoading: false,
  isEstimateCalendarVisible: false,
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
  services: [],
  isLoadingServices: false,
  addressEstimateInfo: null,
  isCheckingEstimateFee: false,
  accordionSteps: initialAccordionSteps,
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

  // 견적 캘린더
  openEstimateCalendar: () => set({ isEstimateCalendarVisible: true }),
  closeEstimateCalendar: () => set({ isEstimateCalendarVisible: false }),

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

  // 서비스 목록 로드
  loadServices: async () => {
    set({ isLoadingServices: true });
    try {
      const services = await getServices();
      set({
        services,
        isLoadingServices: false,
      });
    } catch {
      set({ isLoadingServices: false });
    }
  },

  getFilteredRegionsForService: (serviceId) => {
    const { services } = get();
    if (!serviceId) return [];

    return getServiceableRegionsForService(services, serviceId);
  },

  // 견적 비용 액션
  checkEstimateFee: () => {
    const { formData, addressSelection, services } = get();
    const { service } = formData;
    const { region, city } = addressSelection;

    if (!service || !region || !city) {
      set({ addressEstimateInfo: null });
      return;
    }

    const estimateInfo = checkEstimateFeeByRegion(services, service.id, region.id, city.id);
    set({ addressEstimateInfo: estimateInfo });
  },

  resetEstimateFeeInfo: () => {
    set({
      addressEstimateInfo: null,
      isCheckingEstimateFee: false,
    });
  },

  // Accordion 액션 (통합 예약 페이지용)
  setStepStatus: (step, status) => {
    const { accordionSteps } = get();
    const currentStep = accordionSteps[step];
    if (!currentStep) return;

    set({
      accordionSteps: {
        ...accordionSteps,
        [step]: { ...currentStep, status },
      },
    });
  },

  setStepExpanded: (step, isExpanded) => {
    const { accordionSteps } = get();
    const currentStep = accordionSteps[step];
    if (!currentStep) return;

    set({
      accordionSteps: {
        ...accordionSteps,
        [step]: { ...currentStep, isExpanded },
      },
    });
  },

  toggleStepExpanded: (step) => {
    const { accordionSteps } = get();
    const currentStep = accordionSteps[step];
    if (!currentStep || currentStep.status === 'locked') return;

    set({
      accordionSteps: {
        ...accordionSteps,
        [step]: { ...currentStep, isExpanded: !currentStep.isExpanded },
      },
    });
  },

  completeStep: (step) => {
    const { accordionSteps } = get();
    const nextStep = getNextStep(step);

    // 현재 단계 완료 처리
    const updatedSteps = { ...accordionSteps };
    const currentStepState = updatedSteps[step];
    if (currentStepState) {
      updatedSteps[step] = { status: 'completed', isExpanded: false };
    }

    // 다음 단계 활성화
    if (nextStep) {
      updatedSteps[nextStep] = { status: 'active', isExpanded: true };
    }

    set({ accordionSteps: updatedSteps });
  },

  goToStep: (step) => {
    const { accordionSteps } = get();
    const stepIndex = STEP_ORDER.indexOf(step);

    // 모든 단계 상태 업데이트
    const updatedSteps = { ...accordionSteps };

    STEP_ORDER.forEach((s, index) => {
      if (index < stepIndex) {
        // 이전 단계들은 완료 상태로
        updatedSteps[s] = { status: 'completed', isExpanded: false };
      } else if (index === stepIndex) {
        // 목표 단계는 활성화
        updatedSteps[s] = { status: 'active', isExpanded: true };
      } else {
        // 이후 단계들은 잠금 상태로
        updatedSteps[s] = { status: 'locked', isExpanded: false };
      }
    });

    set({ accordionSteps: updatedSteps });
  },

  resetAccordionSteps: () => {
    set({ accordionSteps: initialAccordionSteps });
  },

  // 리셋
  reset: () => set(initialState),
}));

/**
 * 예약 UI 상태를 선택적으로 구독하는 훅
 * @example
 * const { formData, isLoading } = useReservationStore(['formData', 'isLoading']);
 */
export const useReservationStore: StoreWithShallow<ReservationStore> = (keys, withEqualityFn = true) =>
  useStoreWithShallow(reservationStore, keys, withEqualityFn);
