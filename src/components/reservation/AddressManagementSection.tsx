import type { Service } from '@api/types';
import { Card } from '@components/ui';
import { useReservationStore } from '@store';
import { colors } from '@toss/tds-colors';
import type { AddressSearchResult, ReservationFormData, ServiceableRegion } from '@types';
import { buildRegionPrefix } from '@utils';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { AddressSearchDrawer } from './AddressSearchDrawer';
import { AddressSelectionSection } from './AddressSelectionSection';
import { CitySelectBottomSheet } from './CitySelectBottomSheet';
import { RegionSelectBottomSheet } from './RegionSelectBottomSheet';

interface AddressManagementSectionProps {
  currentService: Service | null;
  services: Service[] | undefined;
  filteredRegions: ServiceableRegion[];
}

export function AddressManagementSection({
  currentService,
  services,
  filteredRegions,
}: AddressManagementSectionProps) {
  const { setValue, watch } = useFormContext<ReservationFormData>();

  // ===== Store =====
  const {
    addressSelection,
    isRegionBottomSheetOpen,
    isCityBottomSheetOpen,
    cities,
    isAddressSearchDrawerOpen,
    update,
    selectRegion,
    selectCity,
    resetEstimateFeeInfo,
    checkEstimateFee,
  } = useReservationStore([
    'addressSelection',
    'isRegionBottomSheetOpen',
    'isCityBottomSheetOpen',
    'cities',
    'isAddressSearchDrawerOpen',
    'update',
    'selectRegion',
    'selectCity',
    'resetEstimateFeeInfo',
    'checkEstimateFee',
  ]);

  // ===== React Hook Form 값 감시 =====
  const formAddress = watch('customerInfo.address');
  const formDetailAddress = watch('customerInfo.detailAddress');

  // ===== 로컬 상태 =====
  const [localSelectedAddress, setLocalSelectedAddress] = useState<AddressSearchResult | null>(null);
  const [detailAddress, setDetailAddress] = useState('');

  // ===== Computed Values =====
  const regionPrefix = useMemo(() => buildRegionPrefix(addressSelection), [addressSelection]);

  const serviceableRegionsList = useMemo(
    () =>
      filteredRegions.map((r) => ({
        id: r.id,
        name: r.name,
      })),
    [filteredRegions]
  );

  // ===== React Hook Form 값을 로컬 상태로 복원 =====
  useEffect(() => {
    // 주소가 있는데 로컬 상태가 비어있으면 복원
    if (formAddress && !localSelectedAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSelectedAddress({
        roadAddress: formAddress,
        jibunAddress: '',
        zipCode: '',
      });
    }

    // 상세주소 복원
    if (formDetailAddress && !detailAddress) {
      setDetailAddress(formDetailAddress);
    }
  }, [formAddress, formDetailAddress, localSelectedAddress, detailAddress]);

  // ===== 구/군 BottomSheet 데이터 로딩 =====
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

  // ===== 핸들러 =====
  const handleAddressSelect = (address: AddressSearchResult) => {
    setLocalSelectedAddress(address);
    update({ isAddressSearchDrawerOpen: false });
    setValue('customerInfo.address', address.roadAddress);

    if (currentService && services) {
      checkEstimateFee(currentService.id, services);
    }
  };

  const handleClearAddress = () => {
    setLocalSelectedAddress(null);
    setDetailAddress('');
    setValue('customerInfo.address', '');
    setValue('customerInfo.detailAddress', '');
    resetEstimateFeeInfo();
  };

  const handleDetailAddressChange = (value: string) => {
    setDetailAddress(value);
    setValue('customerInfo.detailAddress', value);
  };

  const handleOpenSearchDrawer = () => {
    update({ isAddressSearchDrawerOpen: true });
  };

  const handleBackToRegion = () => {
    update({ isCityBottomSheetOpen: false, isRegionBottomSheetOpen: true });
  };

  // ===== 서비스 미선택 시 빈 상태 =====
  if (!currentService) {
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
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
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
