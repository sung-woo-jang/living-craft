import { createRoute } from '@granite-js/react-native';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import {
  CitySelectBottomSheet,
  CustomerInfoStep,
  getCitiesByRegion,
  getRegions,
  RegionSelectBottomSheet,
  useReservationForm,
  useReservationStore,
} from '@widgets/reservation';
import { useCallback, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

export const Route = createRoute('/reservation/customer', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const {
    formData,
    updateFormData,
    isLoading,
    // BottomSheet 관련 상태
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    regions,
    cities,
    isLoadingRegions,
    isLoadingCities,
    addressSelection,
    setIsRegionBottomSheetOpen,
    setIsCityBottomSheetOpen,
    setRegions,
    setCities,
    setIsLoadingRegions,
    setIsLoadingCities,
    selectRegion,
    selectCity,
  } = useReservationStore([
    'formData',
    'updateFormData',
    'isLoading',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'regions',
    'cities',
    'isLoadingRegions',
    'isLoadingCities',
    'addressSelection',
    'setIsRegionBottomSheetOpen',
    'setIsCityBottomSheetOpen',
    'setRegions',
    'setCities',
    'setIsLoadingRegions',
    'setIsLoadingCities',
    'selectRegion',
    'selectCity',
  ]);

  const { methods, canProceedToNext, validateStep } = useReservationForm();

  // 마운트 시 store에서 폼 데이터 복원
  useEffect(() => {
    methods.reset(formData);
  }, []);

  // 폼 값 변경 시 store에 저장
  useEffect(() => {
    const subscription = methods.watch((value) => {
      updateFormData(value as Partial<typeof formData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  // 이전 단계 검증
  useEffect(() => {
    if (!validateStep('service')) {
      Alert.alert('알림', '서비스를 먼저 선택해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/service' as never) },
      ]);
      return;
    }
    if (!validateStep('datetime')) {
      Alert.alert('알림', '날짜와 시간을 먼저 선택해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/datetime' as never) },
      ]);
    }
  }, [navigation, validateStep]);

  // 지역 목록 로드
  const loadRegions = useCallback(async () => {
    setIsLoadingRegions(true);
    try {
      const data = await getRegions();
      setRegions(data);
    } catch (error) {
      console.error('지역 목록 로드 실패:', error);
      setRegions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  }, [setIsLoadingRegions, setRegions]);

  // 구/군 목록 로드
  const loadCities = useCallback(
    async (regionId: string) => {
      setIsLoadingCities(true);
      try {
        const data = await getCitiesByRegion(regionId);
        setCities(data);
      } catch (error) {
        console.error('구/군 목록 로드 실패:', error);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    },
    [setIsLoadingCities, setCities]
  );

  // 시/도 바텀시트 오픈 시 지역 목록 로드
  useEffect(() => {
    if (isRegionBottomSheetOpen && regions.length === 0) {
      loadRegions();
    }
  }, [isRegionBottomSheetOpen, regions.length, loadRegions]);

  // 구/군 바텀시트 오픈 시 구/군 목록 로드
  useEffect(() => {
    if (isCityBottomSheetOpen && addressSelection.region) {
      loadCities(addressSelection.region.id);
    }
  }, [isCityBottomSheetOpen, addressSelection.region, loadCities]);

  // BottomSheet 핸들러
  const handleCloseRegionSheet = useCallback(() => {
    setIsRegionBottomSheetOpen(false);
  }, [setIsRegionBottomSheetOpen]);

  const handleCloseCitySheet = useCallback(() => {
    setIsCityBottomSheetOpen(false);
  }, [setIsCityBottomSheetOpen]);

  const handleBackToRegion = useCallback(() => {
    setIsRegionBottomSheetOpen(true);
  }, [setIsRegionBottomSheetOpen]);

  const handlePrevious = () => {
    navigation.navigate('/reservation/datetime' as never);
  };

  const handleNext = () => {
    if (!canProceedToNext('customer')) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }
    navigation.navigate('/reservation/confirmation' as never);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ProgressStepper activeStepIndex={2}>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <View style={styles.contentContainer}>
          <CustomerInfoStep />
        </View>

        <BottomCTA.Double
          leftButton={
            <Button
              type="light"
              style="weak"
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={isLoading}
              onPress={handlePrevious}
            >
              이전
            </Button>
          }
          rightButton={
            <Button
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={!canProceedToNext('customer') || isLoading}
              onPress={handleNext}
            >
              다음
            </Button>
          }
        />
      </View>

      {/* BottomSheet들을 container View 바깥에 배치하여 전체 화면을 덮도록 함 */}
      {isRegionBottomSheetOpen && (
        <RegionSelectBottomSheet
          isOpen={isRegionBottomSheetOpen}
          regions={regions}
          isLoading={isLoadingRegions}
          onClose={handleCloseRegionSheet}
          onSelect={selectRegion}
        />
      )}

      {isCityBottomSheetOpen && addressSelection.region && (
        <CitySelectBottomSheet
          isOpen={isCityBottomSheetOpen}
          selectedRegion={addressSelection.region}
          cities={cities}
          isLoading={isLoadingCities}
          onClose={handleCloseCitySheet}
          onSelect={selectCity}
          onBackToRegion={handleBackToRegion}
        />
      )}
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
});
