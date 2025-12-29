import type { Service } from '@shared/api/types';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { buildRegionPrefix } from '../../lib';
import { useReservationStore } from '../../store';
import type { AddressSearchResult, ReservationFormData, ServiceableRegion } from '../../types';
import { AddressSearchDrawer } from '../AddressSearchDrawer';
import { AddressSelectionSection } from '../AddressSelectionSection';
import { CitySelectBottomSheet } from '../CitySelectBottomSheet';
import { RegionSelectBottomSheet } from '../RegionSelectBottomSheet';

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
  const { setValue } = useFormContext<ReservationFormData>();

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
  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      setLocalSelectedAddress(address);
      update({ isAddressSearchDrawerOpen: false });
      setValue('customerInfo.address', address.roadAddress);

      if (currentService && services) {
        checkEstimateFee(currentService.id, services);
      }
    },
    [setLocalSelectedAddress, update, setValue, currentService, checkEstimateFee, services]
  );

  const handleClearAddress = useCallback(() => {
    setLocalSelectedAddress(null);
    setDetailAddress('');
    setValue('customerInfo.address', '');
    setValue('customerInfo.detailAddress', '');
    resetEstimateFeeInfo();
  }, [setLocalSelectedAddress, setDetailAddress, setValue, resetEstimateFeeInfo]);

  const handleDetailAddressChange = useCallback(
    (value: string) => {
      setDetailAddress(value);
      setValue('customerInfo.detailAddress', value);
    },
    [setDetailAddress, setValue]
  );

  const handleOpenSearchDrawer = useCallback(() => {
    update({ isAddressSearchDrawerOpen: true });
  }, [update]);

  const handleBackToRegion = useCallback(() => {
    update({ isCityBottomSheetOpen: false, isRegionBottomSheetOpen: true });
  }, [update]);

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
