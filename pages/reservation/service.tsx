import { createRoute } from '@granite-js/react-native';
import { Card } from '@shared/ui';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button, IconButton, TextField } from '@toss/tds-react-native';
import type { AddressSearchResult } from '@widgets/reservation';
import {
  AddressSelectionSection,
  CitySelectBottomSheet,
  RegionSelectBottomSheet,
  ServiceSelectionStep,
  useReservationForm,
  useReservationStore,
} from '@widgets/reservation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/reservation/service', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const {
    formData,
    updateFormData,
    // 지역 선택 상태
    addressSelection,
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    cities,
    serviceableRegions,
    // 주소 검색 상태
    showAddressDetailInput,
    selectedAddress,
    // 액션
    loadServiceableRegions,
    setIsRegionBottomSheetOpen,
    setIsCityBottomSheetOpen,
    setCities,
    selectRegion,
    selectCity,
    selectAddress,
    resetAddressSearch,
    getFilteredRegionsForService,
  } = useReservationStore([
    'formData',
    'updateFormData',
    'addressSelection',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'cities',
    'serviceableRegions',
    'showAddressDetailInput',
    'selectedAddress',
    'loadServiceableRegions',
    'setIsRegionBottomSheetOpen',
    'setIsCityBottomSheetOpen',
    'setCities',
    'selectRegion',
    'selectCity',
    'selectAddress',
    'resetAddressSearch',
    'getFilteredRegionsForService',
  ]);

  const { methods, canProceedToNext } = useReservationForm();

  // 서비스 변경 감지를 위한 이전 서비스 ID 추적
  const prevServiceIdRef = useRef<string | null>(null);

  // 현재 주소 값 감시
  const currentAddress = methods.watch('customerInfo.address');
  const currentDetailAddress = methods.watch('customerInfo.detailAddress');

  // 주소가 완전히 입력되었는지 확인
  const hasCompleteAddress = currentAddress && currentAddress.trim() !== '' && currentDetailAddress && currentDetailAddress.trim() !== '';

  // React Hook Form에서 직접 watch (즉각적인 반응성)
  const currentService = methods.watch('service');

  // 선택된 서비스에 따라 필터링된 지역 목록
  const filteredRegions = useMemo(() => {
    if (!currentService) return [];
    return getFilteredRegionsForService(currentService.id);
  }, [currentService, getFilteredRegionsForService, serviceableRegions]);

  // 서비스가 선택되었는지 여부
  const hasSelectedService = currentService !== null;

  // 마운트 시 서비스 가능 지역 로드 + 폼 데이터 복원
  useEffect(() => {
    loadServiceableRegions();
    methods.reset(formData);
  }, []);

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
        setCities(selectedRegion.cities);
      }
    }
  }, [isCityBottomSheetOpen, addressSelection.region, filteredRegions]);

  // 서비스 변경 시 주소 초기화
  useEffect(() => {
    if (!currentService) {
      prevServiceIdRef.current = null;
      return;
    }

    // 이전 서비스와 다른 경우에만 초기화 (최초 선택 제외)
    if (prevServiceIdRef.current !== null && prevServiceIdRef.current !== currentService.id) {
      resetAddressSearch();
      methods.setValue('customerInfo.address', '');
      methods.setValue('customerInfo.detailAddress', '');
    }

    prevServiceIdRef.current = currentService.id;
  }, [currentService?.id, resetAddressSearch, methods]);

  // 주소 선택 핸들러
  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      selectAddress(address);
    },
    [selectAddress]
  );

  // 상세 주소 확인 핸들러
  const handleConfirmAddress = useCallback(
    (detailAddress: string) => {
      if (!selectedAddress || !detailAddress.trim()) {
        return;
      }

      // 폼 데이터 업데이트
      methods.setValue('customerInfo.address', selectedAddress.roadAddress);
      methods.setValue('customerInfo.detailAddress', detailAddress.trim());

      // 검색 상태 초기화 (주소는 유지)
      resetAddressSearch();
    },
    [selectedAddress, methods, resetAddressSearch]
  );

  // 상세 주소 입력에서 뒤로가기
  const handleBackFromDetail = useCallback(() => {
    resetAddressSearch();
  }, [resetAddressSearch]);

  // 주소 변경 핸들러
  const handleChangeAddress = useCallback(() => {
    // 주소 변경을 위해 폼 값 초기화하고 검색 모드로
    methods.setValue('customerInfo.address', '');
    methods.setValue('customerInfo.detailAddress', '');
    resetAddressSearch();
  }, [methods, resetAddressSearch]);

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

    // 이미 주소가 설정된 경우 - 표시만
    if (hasCompleteAddress) {
      return (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>서비스 지역</Text>
            <Text style={styles.sectionSubtitle}>서비스를 받으실 주소입니다</Text>
          </View>

          <TextField.Button
            variant="box"
            label="선택된 주소"
            value={currentDetailAddress ? `${currentAddress} ${currentDetailAddress}` : currentAddress}
            onPress={handleChangeAddress}
            placeholder="주소를 선택하세요"
          />
        </Card>
      );
    }

    // 상세 주소 입력 모드
    if (showAddressDetailInput && selectedAddress) {
      return (
        <Card>
          <View style={styles.detailHeader}>
            <IconButton name="icon-arrow-back-ios-mono" onPress={handleBackFromDetail} accessibilityLabel="뒤로 가기" />
            <Text style={styles.detailTitle}>자세한 주소를 알려주세요</Text>
          </View>

          <TextField.Button
            variant="box"
            label="선택된 주소"
            value={selectedAddress.roadAddress}
            onPress={handleBackFromDetail}
            placeholder="주소를 선택하세요"
          />

          <DetailAddressInput onConfirm={handleConfirmAddress} />
        </Card>
      );
    }

    // 주소 선택/검색 모드
    return (
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>서비스 지역</Text>
          <Text style={styles.sectionSubtitle}>서비스를 받으실 지역을 선택해주세요</Text>
        </View>

        <AddressSelectionSection onAddressSelect={handleAddressSelect} />
      </Card>
    );
  };

  // 선택된 서비스에 대해 필터링된 지역 목록
  const serviceableRegionsList = filteredRegions.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
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
    </FormProvider>
  );
}

// 상세 주소 입력 컴포넌트 (내부 상태 관리)
function DetailAddressInput({ onConfirm }: { onConfirm: (value: string) => void }) {
  const [detailAddress, setDetailAddress] = useState('');

  return (
    <View>
      <TextField
        variant="box"
        label="상세 주소 *"
        labelOption="sustain"
        placeholder="상세주소를 입력해주세요 (예: 우리푸름빌 402호)"
        value={detailAddress}
        onChangeText={setDetailAddress}
      />
      <TouchableOpacity
        style={[styles.confirmButton, !detailAddress.trim() && styles.confirmButtonDisabled]}
        onPress={() => onConfirm(detailAddress)}
        disabled={!detailAddress.trim()}
      >
        <Text style={[styles.confirmButtonText, !detailAddress.trim() && styles.confirmButtonTextDisabled]}>확인</Text>
      </TouchableOpacity>
    </View>
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
  // 상세 주소 입력 스타일
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  confirmButton: {
    backgroundColor: colors.blue500,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grey300,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  confirmButtonTextDisabled: {
    color: colors.grey500,
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
