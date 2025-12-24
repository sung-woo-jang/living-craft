import { createRoute } from '@granite-js/react-native';
import { useServices } from '@shared/hooks';
import { Card } from '@shared/ui';
import { AccordionStep, StepKey } from '@shared/ui/accordion-step';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import type { AddressSearchResult, ReservationFormData } from '@widgets/reservation';
import {
  AddressSearchDrawer,
  AddressSelectionSection,
  CitySelectBottomSheet,
  ConfirmationStep,
  CustomerInfoStep,
  CustomerSummary,
  DateTimeSelectionStep,
  DateTimeSummary,
  DEFAULT_FORM_VALUES,
  RegionSelectBottomSheet,
  reservationStoreApi,
  ServiceSelectionStep,
  ServiceSummary,
  useReservationForm,
  useReservationStore,
} from '@widgets/reservation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, BackHandler, LayoutAnimation, ScrollView, StyleSheet, Text, View } from 'react-native';

export interface ReservationPageParams {
  serviceId?: string;
}

export const Route = createRoute<ReservationPageParams>('/reservation', {
  validateParams: (params): ReservationPageParams => {
    const rawParams = params as Record<string, unknown> | undefined;
    return {
      serviceId:
        typeof rawParams?.serviceId === 'string'
          ? rawParams.serviceId
          : typeof rawParams?.serviceId === 'number'
            ? String(rawParams.serviceId)
            : undefined,
    };
  },
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const params = Route.useParams() as ReservationPageParams | undefined;

  // Refs for auto-scroll
  const scrollViewRef = useRef<ScrollView>(null);
  const stepRefs = useRef<Record<StepKey, View | null>>({
    service: null,
    datetime: null,
    customer: null,
    confirmation: null,
  });

  const {
    formData,
    updateFormData,
    isLoading,
    reset: resetStore,
    // Accordion 상태
    accordionSteps,
    toggleStepExpanded,
    completeStep,
    goToStep,
    resetAccordionSteps,
    // 지역 선택 상태
    addressSelection,
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    cities,
    // 주소 검색 상태
    isAddressSearchDrawerOpen,
    // 서비스 목록 (지역 필터링용)
    services: storeServices,
    // 액션
    update,
    loadServices,
    selectRegion,
    selectCity,
    getFilteredRegionsForService,
    checkEstimateFee,
    resetEstimateFeeInfo,
  } = useReservationStore([
    'formData',
    'updateFormData',
    'isLoading',
    'reset',
    'accordionSteps',
    'toggleStepExpanded',
    'completeStep',
    'goToStep',
    'resetAccordionSteps',
    'addressSelection',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'cities',
    'isAddressSearchDrawerOpen',
    'services',
    'update',
    'loadServices',
    'selectRegion',
    'selectCity',
    'getFilteredRegionsForService',
    'checkEstimateFee',
    'resetEstimateFeeInfo',
  ]);

  const { methods, canProceedToNext, handleSubmit } = useReservationForm({
    initialData: formData,
    onSubmitSuccess: () => {
      resetStore();
      resetAccordionSteps();
      methods.reset(DEFAULT_FORM_VALUES);
      navigation.navigate('/' as never);
    },
  });

  // 서비스 목록 조회
  const { data: services } = useServices();

  // Props에서 타입 안전하게 params 사용
  const serviceIdParam = params?.serviceId ? parseInt(params.serviceId, 10) : null;

  // params 기반 서비스 선택이 이미 처리되었는지 추적
  const paramsProcessedRef = useRef(false);

  // 상세 주소 로컬 상태
  const [detailAddress, setDetailAddress] = useState('');

  // 로컬에서 관리하는 선택된 주소
  const [localSelectedAddress, setLocalSelectedAddress] = useState<AddressSearchResult | null>(null);

  // 현재 주소 값 감시
  const currentAddress = methods.watch('customerInfo.address');

  // 주소가 입력되었는지 확인
  const hasCompleteAddress = currentAddress && currentAddress.trim() !== '';

  // React Hook Form에서 직접 watch
  const currentService = methods.watch('service');

  // 선택된 서비스에 따라 필터링된 지역 목록
  const filteredRegions = useMemo(() => {
    if (!currentService || !storeServices || storeServices.length === 0) return [];
    return getFilteredRegionsForService(currentService.id);
  }, [currentService, storeServices, getFilteredRegionsForService]);

  // 서비스가 선택되었는지 여부
  const hasSelectedService = currentService !== null;

  // 지역 prefix (주소 검색용)
  const regionPrefix = useMemo(() => {
    if (!addressSelection.region) return '';
    if (!addressSelection.city) return addressSelection.region.name;
    return `${addressSelection.region.name} ${addressSelection.city.name}`;
  }, [addressSelection]);

  // 마운트 시 서비스 목록 로드
  useEffect(() => {
    loadServices();

    if (formData.service) {
      methods.setValue('service', formData.service);
    }
  }, []);

  // Query params 기반 서비스 자동 선택
  useEffect(() => {
    if (formData.service) return;
    if (paramsProcessedRef.current) return;

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
      // React Hook Form의 내부 상태를 plain object로 변환
      const plainValue = JSON.parse(JSON.stringify(value));
      updateFormData(plainValue as Partial<ReservationFormData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  // 구/군 BottomSheet 오픈 시 목록 로드
  useEffect(() => {
    if (isCityBottomSheetOpen && addressSelection.region && filteredRegions.length > 0) {
      const selectedRegion = filteredRegions.find((r) => r.id === addressSelection.region?.id);
      if (selectedRegion) {
        const citiesWithRegion = selectedRegion.cities.map((city) => ({
          ...city,
          regionId: selectedRegion.id,
        }));
        update({ cities: citiesWithRegion });
      }
    }
  }, [isCityBottomSheetOpen, addressSelection.region, filteredRegions, update]);

  // 서비스 변경 감지 시 주소 초기화 (Subscribe 패턴)
  useLayoutEffect(() => {
    let prevServiceId: number | null = null;

    const unsubscribe = reservationStoreApi.subscribe((state) => {
      const { formData } = state;
      const selectedService = formData.service;

      // 서비스가 선택되지 않았으면 스킵
      if (!selectedService) {
        prevServiceId = null;
        return;
      }

      // 서비스가 변경되었을 때 주소 초기화
      const isServiceChanged = prevServiceId !== null && selectedService.id !== prevServiceId;
      if (isServiceChanged) {
        reservationStoreApi.getState().resetAddressSearch();
        reservationStoreApi.getState().resetEstimateFeeInfo();
      }

      prevServiceId = selectedService.id;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 서비스 변경 시 로컬 상태 초기화
  useEffect(() => {
    if (!currentService) return;

    // 서비스가 변경되면 로컬 주소 상태 초기화 (다음 렌더링에서 실행)
    const timeoutId = setTimeout(() => {
      setLocalSelectedAddress(null);
      setDetailAddress('');

      // Zustand store에서 관리하는 formData를 업데이트 (plain object로 변환)
      const currentCustomerInfo = JSON.parse(JSON.stringify(formData.customerInfo));
      updateFormData({
        customerInfo: {
          ...currentCustomerInfo,
          address: '',
          detailAddress: '',
        },
      });

      // React Hook Form도 동기화
      methods.setValue('customerInfo.address', '', { shouldValidate: false });
      methods.setValue('customerInfo.detailAddress', '', { shouldValidate: false });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentService?.id, methods, updateFormData, formData.customerInfo]);

  // 로딩 중 뒤로가기 차단
  useEffect(() => {
    if (isLoading) {
      const handleBackPress = () => {
        Alert.alert('처리 중', '예약 처리가 진행 중입니다. 잠시만 기다려주세요.');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
    return () => {};
  }, [isLoading]);

  // 주소 선택 핸들러
  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      setLocalSelectedAddress(address);
      update({ isAddressSearchDrawerOpen: false });

      // Zustand store 업데이트 (plain object로 변환)
      const currentCustomerInfo = JSON.parse(JSON.stringify(formData.customerInfo));
      updateFormData({
        customerInfo: {
          ...currentCustomerInfo,
          address: address.roadAddress,
        },
      });

      // React Hook Form 동기화
      methods.setValue('customerInfo.address', address.roadAddress, { shouldValidate: false });

      if (currentService) {
        checkEstimateFee();
      }
    },
    [setLocalSelectedAddress, update, updateFormData, formData.customerInfo, methods, currentService, checkEstimateFee]
  );

  // 주소 삭제 핸들러
  const handleClearAddress = useCallback(() => {
    setLocalSelectedAddress(null);
    setDetailAddress('');

    // Zustand store 업데이트 (plain object로 변환)
    const currentCustomerInfo = JSON.parse(JSON.stringify(formData.customerInfo));
    updateFormData({
      customerInfo: {
        ...currentCustomerInfo,
        address: '',
        detailAddress: '',
      },
    });

    // React Hook Form 동기화
    methods.setValue('customerInfo.address', '', { shouldValidate: false });
    methods.setValue('customerInfo.detailAddress', '', { shouldValidate: false });

    resetEstimateFeeInfo();
  }, [setLocalSelectedAddress, setDetailAddress, updateFormData, formData.customerInfo, methods, resetEstimateFeeInfo]);

  // 상세 주소 변경 핸들러
  const handleDetailAddressChange = useCallback(
    (value: string) => {
      setDetailAddress(value);

      // Zustand store 업데이트 (plain object로 변환)
      const currentCustomerInfo = JSON.parse(JSON.stringify(formData.customerInfo));
      updateFormData({
        customerInfo: {
          ...currentCustomerInfo,
          detailAddress: value,
        },
      });

      // React Hook Form 동기화
      methods.setValue('customerInfo.detailAddress', value, { shouldValidate: false });
    },
    [setDetailAddress, updateFormData, formData.customerInfo, methods]
  );

  // 주소 검색 Drawer 열기
  const handleOpenSearchDrawer = useCallback(() => {
    update({ isAddressSearchDrawerOpen: true });
  }, [update]);

  // 시/도 선택 시 구/군 BottomSheet 오픈 핸들러
  const handleBackToRegion = useCallback(() => {
    update({
      isCityBottomSheetOpen: false,
      isRegionBottomSheetOpen: true,
    });
  }, [update]);

  // 단계 완료 및 자동 스크롤
  const handleCompleteStep = useCallback(
    (step: StepKey) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      completeStep(step);

      // 300ms 후 다음 단계로 스크롤
      const stepOrder: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];
      const currentIndex = stepOrder.indexOf(step);
      const nextStep = stepOrder[currentIndex + 1];

      if (nextStep) {
        setTimeout(() => {
          const nextRef = stepRefs.current[nextStep];
          if (nextRef && scrollViewRef.current) {
            nextRef.measureLayout(
              scrollViewRef.current.getInnerViewNode(),
              (_x, y) => {
                scrollViewRef.current?.scrollTo({ y: y - 16, animated: true });
              },
              () => {}
            );
          }
        }, 300);
      }
    },
    [completeStep]
  );

  // 자동 전환: 서비스 선택 단계
  useEffect(() => {
    const currentStep = accordionSteps.service;
    if (!currentStep || currentStep.status !== 'active' || !currentStep.isExpanded) {
      return undefined;
    }

    if (canProceedToNext('service') && hasCompleteAddress) {
      const timerId = setTimeout(() => {
        // 타이머 실행 시점에 조건 재검증
        if (canProceedToNext('service') && hasCompleteAddress) {
          handleCompleteStep('service');
        }
      }, 1000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [
    canProceedToNext('service'),
    hasCompleteAddress,
    accordionSteps.service?.status,
    accordionSteps.service?.isExpanded,
    handleCompleteStep,
  ]);

  // 자동 전환: 날짜/시간 선택 단계
  useEffect(() => {
    const currentStep = accordionSteps.datetime;
    if (!currentStep || currentStep.status !== 'active' || !currentStep.isExpanded) {
      return undefined;
    }

    if (canProceedToNext('datetime')) {
      const timerId = setTimeout(() => {
        if (canProceedToNext('datetime')) {
          handleCompleteStep('datetime');
        }
      }, 800);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [
    canProceedToNext('datetime'),
    accordionSteps.datetime?.status,
    accordionSteps.datetime?.isExpanded,
    handleCompleteStep,
  ]);

  // 자동 전환: 고객 정보 단계
  useEffect(() => {
    const currentStep = accordionSteps.customer;
    if (!currentStep || currentStep.status !== 'active' || !currentStep.isExpanded) {
      return undefined;
    }

    if (canProceedToNext('customer')) {
      const timerId = setTimeout(() => {
        if (canProceedToNext('customer')) {
          handleCompleteStep('customer');
        }
      }, 1000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [
    canProceedToNext('customer'),
    accordionSteps.customer?.status,
    accordionSteps.customer?.isExpanded,
    handleCompleteStep,
  ]);

  // 단계 토글
  const handleToggleStep = useCallback(
    (step: StepKey) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toggleStepExpanded(step);
    },
    [toggleStepExpanded]
  );

  // 완료된 단계 수정
  const handleEditCompletedStep = useCallback(
    (step: StepKey) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      goToStep(step);

      setTimeout(() => {
        const ref = stepRefs.current[step];
        if (ref && scrollViewRef.current) {
          ref.measureLayout(
            scrollViewRef.current.getInnerViewNode(),
            (_x, y) => {
              scrollViewRef.current?.scrollTo({ y: y - 16, animated: true });
            },
            () => {}
          );
        }
      }, 300);
    },
    [goToStep]
  );

  // 나가기
  const handleExit = () => {
    navigation.navigate('/' as never);
  };

  // 예약 완료
  const onSubmit = async () => {
    if (!canProceedToNext('confirmation')) {
      Alert.alert('알림', '이용약관에 동의해주세요.');
      return;
    }
    await handleSubmit();
  };

  // 선택된 서비스에 대해 필터링된 지역 목록
  const serviceableRegionsList = filteredRegions.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  // 주소 정보 섹션 렌더링
  const renderAddressSection = () => {
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>예약을 처리하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {/* Step 1: 서비스 선택 */}
          <View ref={(ref) => (stepRefs.current.service = ref)}>
            <AccordionStep
              stepKey="service"
              stepNumber={1}
              title="서비스 선택"
              status={accordionSteps.service?.status ?? 'active'}
              isExpanded={accordionSteps.service?.isExpanded ?? true}
              summaryContent={<ServiceSummary />}
              onToggle={() =>
                accordionSteps.service?.status === 'completed'
                  ? handleEditCompletedStep('service')
                  : handleToggleStep('service')
              }
              onComplete={() => handleCompleteStep('service')}
              isCompleteDisabled={!canProceedToNext('service') || !hasCompleteAddress}
              hideCompleteButton
            >
              <ServiceSelectionStep withScrollView={false} />
              {renderAddressSection()}
            </AccordionStep>
          </View>

          {/* Step 2: 날짜/시간 선택 */}
          <View ref={(ref) => (stepRefs.current.datetime = ref)}>
            <AccordionStep
              stepKey="datetime"
              stepNumber={2}
              title="날짜/시간 선택"
              status={accordionSteps.datetime?.status ?? 'locked'}
              isExpanded={accordionSteps.datetime?.isExpanded ?? false}
              summaryContent={<DateTimeSummary />}
              onToggle={() =>
                accordionSteps.datetime?.status === 'completed'
                  ? handleEditCompletedStep('datetime')
                  : handleToggleStep('datetime')
              }
              onComplete={() => handleCompleteStep('datetime')}
              isCompleteDisabled={!canProceedToNext('datetime')}
              hideCompleteButton
            >
              <DateTimeSelectionStep withScrollView={false} />
            </AccordionStep>
          </View>

          {/* Step 3: 고객 정보 */}
          <View ref={(ref) => (stepRefs.current.customer = ref)}>
            <AccordionStep
              stepKey="customer"
              stepNumber={3}
              title="고객 정보"
              status={accordionSteps.customer?.status ?? 'locked'}
              isExpanded={accordionSteps.customer?.isExpanded ?? false}
              summaryContent={<CustomerSummary />}
              onToggle={() =>
                accordionSteps.customer?.status === 'completed'
                  ? handleEditCompletedStep('customer')
                  : handleToggleStep('customer')
              }
              onComplete={() => handleCompleteStep('customer')}
              isCompleteDisabled={!canProceedToNext('customer')}
              hideCompleteButton
            >
              <CustomerInfoStep withScrollView={false} />
            </AccordionStep>
          </View>

          {/* Step 4: 예약 확인 */}
          <View ref={(ref) => (stepRefs.current.confirmation = ref)}>
            <AccordionStep
              stepKey="confirmation"
              stepNumber={4}
              title="예약 확인"
              status={accordionSteps.confirmation?.status ?? 'locked'}
              isExpanded={accordionSteps.confirmation?.isExpanded ?? false}
              onToggle={() => handleToggleStep('confirmation')}
            >
              <ConfirmationStep withScrollView={false} />
            </AccordionStep>
          </View>
        </ScrollView>

        <BottomCTA.Double
          leftButton={
            <Button
              type="light"
              style="weak"
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={isLoading}
              onPress={handleExit}
            >
              나가기
            </Button>
          }
          rightButton={
            <Button
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={!canProceedToNext('confirmation') || isLoading}
              loading={isLoading}
              onPress={onSubmit}
            >
              예약 완료
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
        onClose={() => update({ isRegionBottomSheetOpen: false })}
      />

      {/* 구/군 선택 BottomSheet */}
      <CitySelectBottomSheet
        isOpen={isCityBottomSheetOpen}
        selectedRegion={addressSelection.region}
        cities={cities}
        isLoading={false}
        onSelect={selectCity}
        onClose={() => update({ isCityBottomSheetOpen: false })}
        onBackToRegion={handleBackToRegion}
      />

      {/* 주소 검색 Drawer */}
      <AddressSearchDrawer
        isOpen={isAddressSearchDrawerOpen}
        regionPrefix={regionPrefix}
        onClose={() => update({ isAddressSearchDrawerOpen: false })}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greyBackground,
  },
  loadingText: {
    fontSize: 16,
    color: colors.grey700,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
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
