import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { IconButton, TextField } from '@toss/tds-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getCitiesByRegion, getRegions } from '../api';
import { useReservationStore } from '../store';
import { AddressSearchResult, CityData, RegionData, ReservationFormData } from '../types';
import { AddressSelectionSection } from './AddressSelectionSection';
import { CitySelectBottomSheet } from './CitySelectBottomSheet';
import { PhotoSection } from './PhotoSection';
import { RegionSelectBottomSheet } from './RegionSelectBottomSheet';

export function CustomerInfoStep() {
  const { control, setValue, watch } = useFormContext<ReservationFormData>();

  const {
    showAddressDetailInput,
    selectedAddress,
    selectAddress,
    resetAddressSearch,
    addressSelection,
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    regions,
    cities,
    isLoadingRegions,
    isLoadingCities,
    setIsRegionBottomSheetOpen,
    setIsCityBottomSheetOpen,
    setRegions,
    setCities,
    setIsLoadingRegions,
    setIsLoadingCities,
    selectRegion,
    selectCity,
  } = useReservationStore([
    'showAddressDetailInput',
    'selectedAddress',
    'selectAddress',
    'resetAddressSearch',
    'addressSelection',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'regions',
    'cities',
    'isLoadingRegions',
    'isLoadingCities',
    'setIsRegionBottomSheetOpen',
    'setIsCityBottomSheetOpen',
    'setRegions',
    'setCities',
    'setIsLoadingRegions',
    'setIsLoadingCities',
    'selectRegion',
    'selectCity',
  ]);

  // 현재 주소 값 감시
  const currentAddress = watch('customerInfo.address');
  const currentDetailAddress = watch('customerInfo.detailAddress');

  // 주소가 이미 설정되어 있는지 확인
  const hasAddress = currentAddress && currentAddress.trim() !== '';

  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      selectAddress(address);
    },
    [selectAddress]
  );

  const handleConfirmAddress = useCallback(
    (detailAddress: string) => {
      if (!selectedAddress || !detailAddress.trim()) {
        return;
      }

      // 폼 데이터 업데이트
      setValue('customerInfo.address', selectedAddress.roadAddress);
      setValue('customerInfo.detailAddress', detailAddress.trim());

      // 검색 상태 초기화 (주소는 유지)
      resetAddressSearch();
    },
    [selectedAddress, setValue, resetAddressSearch]
  );

  const handleBackFromDetail = useCallback(() => {
    resetAddressSearch();
  }, [resetAddressSearch]);

  const handleChangeAddress = useCallback(() => {
    // 주소 변경을 위해 폼 값 초기화하고 검색 모드로
    setValue('customerInfo.address', '');
    setValue('customerInfo.detailAddress', '');
    resetAddressSearch();
  }, [setValue, resetAddressSearch]);

  // BottomSheet 핸들러들
  const handleCloseRegionSheet = useCallback(() => {
    setIsRegionBottomSheetOpen(false);
  }, [setIsRegionBottomSheetOpen]);

  const handleCloseCitySheet = useCallback(() => {
    setIsCityBottomSheetOpen(false);
  }, [setIsCityBottomSheetOpen]);

  const handleSelectRegion = useCallback(
    (region: RegionData) => {
      selectRegion(region);
    },
    [selectRegion]
  );

  const handleSelectCity = useCallback(
    (city: CityData) => {
      selectCity(city);
    },
    [selectCity]
  );

  const handleBackToRegion = useCallback(() => {
    setIsRegionBottomSheetOpen(true);
  }, [setIsRegionBottomSheetOpen]);

  // 지역 목록 로드 함수
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

  // 구/군 목록 로드 함수
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

  // 주소 정보 Card 내용 렌더링
  const renderAddressSection = () => {
    // 이미 주소가 설정된 경우 - 표시만
    if (hasAddress) {
      return (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>주소 정보</Text>
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
          <Text style={styles.sectionTitle}>주소 검색</Text>
          <Text style={styles.sectionSubtitle}>서비스를 받으실 주소를 검색해주세요</Text>
        </View>

        <AddressSelectionSection onAddressSelect={handleAddressSelect} />
      </Card>
    );
  };

  return (
    <>
      <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>고객 정보</Text>
            <Text style={styles.sectionSubtitle}>예약자 정보를 입력해주세요</Text>
          </View>

          <Controller
            control={control}
            name="customerInfo.name"
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="box"
                label="이름 *"
                labelOption="sustain"
                placeholder="이름을 입력해주세요"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="customerInfo.phone"
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="box"
                label="연락처 *"
                labelOption="sustain"
                placeholder="010-1234-5678"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="customerInfo.requirements"
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="box"
                label="추가 요청사항"
                labelOption="sustain"
                placeholder="추가로 요청하실 사항이 있으시면 입력해주세요"
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Card>

        {renderAddressSection()}

        <Card>
          <Controller
            control={control}
            name="customerInfo.photos"
            render={({ field: { onChange, value } }) => (
              <PhotoSection photos={value ?? []} onChange={onChange} maxCount={5} />
            )}
          />
        </Card>
      </ScrollView>

      {isRegionBottomSheetOpen && (
        <RegionSelectBottomSheet
          isOpen={isRegionBottomSheetOpen}
          regions={regions}
          isLoading={isLoadingRegions}
          onClose={handleCloseRegionSheet}
          onSelect={handleSelectRegion}
        />
      )}

      {isCityBottomSheetOpen && addressSelection.region && (
        <CitySelectBottomSheet
          isOpen={isCityBottomSheetOpen}
          selectedRegion={addressSelection.region}
          cities={cities}
          isLoading={isLoadingCities}
          onClose={handleCloseCitySheet}
          onSelect={handleSelectCity}
          onBackToRegion={handleBackToRegion}
        />
      )}
    </>
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
  stepContent: {
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
});
