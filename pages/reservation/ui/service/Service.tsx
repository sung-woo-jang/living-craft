import { useRoute } from '@granite-js/native/@react-navigation/native';
import { useServices } from '@shared/hooks';
import { Card } from '@shared/ui';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import type { AddressSearchResult } from '@widgets/reservation';
import {
  AddressSearchDrawer,
  AddressSelectionSection,
  CitySelectBottomSheet,
  RegionSelectBottomSheet,
  ServiceSelectionStep,
  useReservationForm,
  useReservationStore,
} from '@widgets/reservation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ServicePageProps {
  navigation: any;
}

export function ServicePage({ navigation }: ServicePageProps) {
  const {
    formData,
    updateFormData,
    // 지역 선택 상태
    addressSelection,
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    cities,
    // 주소 검색 상태
    isAddressSearchDrawerOpen,
    // 액션
    loadServices,
    setIsRegionBottomSheetOpen,
    setIsCityBottomSheetOpen,
    setCities,
    selectRegion,
    selectCity,
    resetAddressSearch,
    getFilteredRegionsForService,
    checkEstimateFee,
    resetEstimateFeeInfo,
    openAddressSearchDrawer,
    closeAddressSearchDrawer,
  } = useReservationStore([
    'formData',
    'updateFormData',
    'addressSelection',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'cities',
    'isAddressSearchDrawerOpen',
    'loadServices',
    'setIsRegionBottomSheetOpen',
    'setIsCityBottomSheetOpen',
    'setCities',
    'selectRegion',
    'selectCity',
    'resetAddressSearch',
    'getFilteredRegionsForService',
    'checkEstimateFee',
    'resetEstimateFeeInfo',
    'openAddressSearchDrawer',
    'closeAddressSearchDrawer',
  ]);

  const { methods, canProceedToNext } = useReservationForm({ initialData: formData });

  // 서비스 목록 조회 (params 기반 서비스 선택에 필요)
  const { data: services } = useServices();

  // React Navigation route에서 params 가져오기 (프로모션 배너 등에서 전달)
  const route = useRoute();
  const routeParams = route.params as { serviceId?: string } | undefined;
  const serviceIdParam = routeParams?.serviceId ? parseInt(routeParams.serviceId, 10) : null;

  // 서비스 변경 감지를 위한 이전 서비스 ID 추적
  const prevServiceIdRef = useRef<number | null>(null);

  // params 기반 서비스 선택이 이미 처리되었는지 추적
  const paramsProcessedRef = useRef(false);

  // 상세 주소 로컬 상태 (inline 입력용)
  const [detailAddress, setDetailAddress] = useState('');

  // 로컬에서 관리하는 선택된 주소 (Drawer에서 선택 후 유지)
  const [localSelectedAddress, setLocalSelectedAddress] = useState<AddressSearchResult | null>(null);

  // 현재 주소 값 감시
  const currentAddress = methods.watch('customerInfo.address');

  // 주소가 입력되었는지 확인 (상세 주소는 선택사항)
  const hasCompleteAddress = currentAddress && currentAddress.trim() !== '';

  // React Hook Form에서 직접 watch (즉각적인 반응성)
  const currentService = methods.watch('service');

  // 선택된 서비스에 따라 필터링된 지역 목록
  const filteredRegions = useMemo(() => {
    if (!currentService) return [];
    return getFilteredRegionsForService(currentService.id);
  }, [currentService, getFilteredRegionsForService]);

  // 서비스가 선택되었는지 여부
  const hasSelectedService = currentService !== null;

  // 지역 prefix (주소 검색용)
  const regionPrefix = useMemo(() => {
    if (!addressSelection.region) return '';
    if (!addressSelection.city) return addressSelection.region.name;
    return `${addressSelection.region.name} ${addressSelection.city.name}`;
  }, [addressSelection]);

  // 마운트 시 서비스 목록 로드 + 외부에서 전달된 서비스 초기값 적용
  useEffect(() => {
    loadServices();

    // 타이밍 문제 해결: Store에서 service가 있으면 RHF에 명시적으로 설정
    if (formData.service) {
      methods.setValue('service', formData.service);
    }
  }, []);

  // Query params 기반 서비스 자동 선택
  // - Store에 서비스가 없고 serviceIdParam이 있으면 해당 서비스 선택
  // - 프로모션 배너 등에서 ?serviceId=1 형태로 전달받은 경우
  useEffect(() => {
    // Store에 이미 서비스가 있으면 Store 값 우선 (HomeServicesSection에서 온 경우)
    if (formData.service) {
      return;
    }

    // params 처리가 이미 완료되었으면 스킵
    if (paramsProcessedRef.current) {
      return;
    }

    // serviceIdParam이 있고 서비스 목록이 로드되었으면 해당 서비스 선택
    if (serviceIdParam && services && services.length > 0) {
      const targetService = services.find((s) => s.id === serviceIdParam);
      if (targetService) {
        methods.setValue('service', targetService);
        updateFormData({ service: targetService });
        paramsProcessedRef.current = true;
      }
    }
  }, [serviceIdParam, services, formData.service, methods, updateFormData]);

  // 폼 값 변경 시 store에 저장
  useEffect(() => {
    const subscription = methods.watch((value) => {
      updateFormData(value as Partial<typeof formData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  // 구/군 BottomSheet 오픈 시 목록 로드 (필터링된 지역에서 가져옴)
  useEffect(() => {
    if (isCityBottomSheetOpen && addressSelection.region && filteredRegions.length > 0) {
      const selectedRegion = filteredRegions.find((r) => r.id === addressSelection.region?.id);
      if (selectedRegion) {
        // ServiceableCity[]를 CityData[]로 변환 (regionId 추가)
        const citiesWithRegion = selectedRegion.cities.map((city) => ({
          ...city,
          regionId: selectedRegion.id,
        }));
        setCities(citiesWithRegion);
      }
    }
  }, [isCityBottomSheetOpen, addressSelection.region, filteredRegions]);

  // 서비스 변경 시 주소 초기화를 위한 핸들러
  const resetAddressState = useCallback(() => {
    resetAddressSearch();
    resetEstimateFeeInfo();
    setLocalSelectedAddress(null);
    setDetailAddress('');
    methods.setValue('customerInfo.address', '');
    methods.setValue('customerInfo.detailAddress', '');
  }, [resetAddressSearch, resetEstimateFeeInfo, methods]);

  // 서비스 변경 감지 - 서비스 변경 시 주소 상태 초기화 필요
  useEffect(() => {
    if (!currentService) {
      prevServiceIdRef.current = null;
      return;
    }

    // 이전 서비스와 다른 경우에만 초기화 (최초 선택 제외)
    if (prevServiceIdRef.current !== null && prevServiceIdRef.current !== currentService.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 서비스 변경 시 의도적인 상태 초기화
      resetAddressState();
    }

    prevServiceIdRef.current = currentService.id;
  }, [currentService?.id, resetAddressState]);

  // 주소 선택 핸들러 (Drawer에서 선택 시)
  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      setLocalSelectedAddress(address);
      closeAddressSearchDrawer();

      // 폼 데이터 업데이트
      methods.setValue('customerInfo.address', address.roadAddress);

      // 견적 비용 조회 (지역/도시 기반)
      if (currentService) {
        checkEstimateFee();
      }
    },
    [closeAddressSearchDrawer, methods, currentService, checkEstimateFee]
  );

  // 주소 삭제 핸들러
  const handleClearAddress = useCallback(() => {
    setLocalSelectedAddress(null);
    setDetailAddress('');
    methods.setValue('customerInfo.address', '');
    methods.setValue('customerInfo.detailAddress', '');
    resetEstimateFeeInfo();
  }, [methods, resetEstimateFeeInfo]);

  // 상세 주소 변경 핸들러
  const handleDetailAddressChange = useCallback(
    (value: string) => {
      setDetailAddress(value);
      methods.setValue('customerInfo.detailAddress', value);
    },
    [methods]
  );

  // 주소 검색 Drawer 열기
  const handleOpenSearchDrawer = useCallback(() => {
    openAddressSearchDrawer();
  }, [openAddressSearchDrawer]);

  // 시/도 선택 시 구/군 BottomSheet 오픈을 위해 뒤로가기 핸들러
  const handleBackToRegion = useCallback(() => {
    setIsCityBottomSheetOpen(false);
    setIsRegionBottomSheetOpen(true);
  }, [setIsCityBottomSheetOpen, setIsRegionBottomSheetOpen]);

  const handleExit = () => {
    navigation.navigate('/' as never);
  };

  const handleNext = () => {
    if (!hasCompleteAddress) {
      Alert.alert('알림', '주소를 입력해주세요.');
      return;
    }
    if (!canProceedToNext('service')) {
      Alert.alert('알림', '서비스를 선택해주세요.');
      return;
    }
    navigation.navigate('/reservation/datetime' as never);
  };

  // 주소 정보 섹션 렌더링
  const renderAddressSection = () => {
    // 서비스가 선택되지 않은 경우
    if (!hasSelectedService) {
      return (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>서비스 지역</Text>
            <Text style={styles.sectionSubtitle}>먼저 서비스를 선택해주세요</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>위에서 원하시는 서비스를 선택하시면</Text>
            <Text style={styles.emptyStateText}>해당 서비스가 가능한 지역을 선택하실 수 있습니다</Text>
          </View>
        </Card>
      );
    }

    // 주소 선택 UI
    return (
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>서비스 지역</Text>
          <Text style={styles.sectionSubtitle}>서비스를 받으실 지역을 선택해주세요</Text>
        </View>

        <AddressSelectionSection
          selectedAddress={localSelectedAddress}
          detailAddress={detailAddress}
          onOpenSearchDrawer={handleOpenSearchDrawer}
          onClearAddress={handleClearAddress}
          onDetailAddressChange={handleDetailAddressChange}
        />
      </Card>
    );
  };

  // 선택된 서비스에 대해 필터링된 지역 목록
  const serviceableRegionsList = filteredRegions.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ProgressStepper activeStepIndex={0}>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <ServiceSelectionStep />

          {renderAddressSection()}
        </ScrollView>

        <BottomCTA.Double
          leftButton={
            <Button type="light" style="weak" display="full" containerStyle={{ borderRadius: 8 }} onPress={handleExit}>
              나가기
            </Button>
          }
          rightButton={
            <Button
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={!hasCompleteAddress || !canProceedToNext('service')}
              onPress={handleNext}
            >
              다음
            </Button>
          }
        />
      </View>

      {/* 지역 선택 BottomSheet */}
      <RegionSelectBottomSheet
        isOpen={isRegionBottomSheetOpen}
        regions={serviceableRegionsList}
        isLoading={false}
        onSelect={selectRegion}
        onClose={() => setIsRegionBottomSheetOpen(false)}
      />

      {/* 구/군 선택 BottomSheet */}
      <CitySelectBottomSheet
        isOpen={isCityBottomSheetOpen}
        selectedRegion={addressSelection.region}
        cities={cities}
        isLoading={false}
        onSelect={selectCity}
        onClose={() => setIsCityBottomSheetOpen(false)}
        onBackToRegion={handleBackToRegion}
      />

      {/* 주소 검색 Drawer */}
      <AddressSearchDrawer
        isOpen={isAddressSearchDrawerOpen}
        regionPrefix={regionPrefix}
        onClose={closeAddressSearchDrawer}
        onSelect={handleAddressSelect}
      />
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.grey600,
  },
  // 빈 상태 스타일
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.grey600,
    textAlign: 'center',
    lineHeight: 20,
  },
});
