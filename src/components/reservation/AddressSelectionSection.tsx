import { colors } from '@toss/tds-colors';
import { Button, TextField } from '@toss/tds-react-native';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useReservationStore } from '@store';
import type { AddressSearchResult } from '@types';

interface Props {
  selectedAddress: AddressSearchResult | null;
  detailAddress: string;
  onOpenSearchDrawer: () => void;
  onClearAddress: () => void;
  onDetailAddressChange: (value: string) => void;
}

export function AddressSelectionSection({
  selectedAddress,
  detailAddress,
  onOpenSearchDrawer,
  onClearAddress,
  onDetailAddressChange,
}: Props) {
  const { addressSelection, addressEstimateInfo, update, resetRegionSelection } = useReservationStore([
    'addressSelection',
    'addressEstimateInfo',
    'update',
    'resetRegionSelection',
  ]);

  const handleOpenRegionSheet = useCallback(() => {
    update({ isRegionBottomSheetOpen: true });
  }, [update]);

  const handleChangeRegion = useCallback(() => {
    resetRegionSelection();
    onClearAddress();
    update({ isRegionBottomSheetOpen: true });
  }, [resetRegionSelection, onClearAddress, update]);

  // 선택된 주소에서 시/도 + 구/군 부분 제외하고 표시
  // 예: "인천광역시 남동구 숙골로 456" → "숙골로 456"
  const displayAddress = useMemo(() => {
    if (!selectedAddress) return '';

    const { region, city } = addressSelection;
    if (!region || !city) return selectedAddress.roadAddress;

    let address = selectedAddress.roadAddress;

    // 시/도 이름 제거
    address = address.replace(region.name, '').trim();
    // 구/군 이름 제거
    address = address.replace(city.name, '').trim();

    return address;
  }, [selectedAddress, addressSelection]);

  // 지역 미선택 시: 시/도 선택 버튼
  if (!addressSelection.region) {
    return (
      <View style={styles.selectRegionContainer}>
        <Text style={styles.selectRegionTitle}>지역 선택</Text>
        <Text style={styles.selectRegionSubtitle}>먼저 서비스를 받으실 지역을 선택해주세요</Text>
        <View style={styles.buttonContainer}>
          <Button onPress={handleOpenRegionSheet}>시/도 선택하기</Button>
        </View>
      </View>
    );
  }

  // 시/도만 선택된 경우: 구/군 선택 중 메시지 표시
  if (!addressSelection.city) {
    return (
      <View style={styles.selectRegionContainer}>
        <Text style={styles.selectRegionTitle}>지역 선택</Text>
        <Text style={styles.selectRegionSubtitle}>{addressSelection.region.name}의 구/군을 선택 중...</Text>
      </View>
    );
  }

  // 시/도 + 구/군 모두 선택된 경우
  return (
    <>
      {/* 서비스 지역 */}
      <TextField.Button
        variant="box"
        label="서비스 지역 *"
        value={`${addressSelection.region.name} ${addressSelection.city.name}`}
        onPress={handleChangeRegion}
        placeholder="지역을 선택하세요"
      />

      {/* 주소 검색 버튼 - 선택된 주소가 있으면 value에 표시 */}
      <TextField.Button
        variant="box"
        label="서비스 주소 *"
        value={displayAddress}
        onPress={onOpenSearchDrawer}
        placeholder="주소 검색하기"
      />

      {/* 상세 주소 입력 (주소 선택 후에만 표시) */}
      {selectedAddress && (
        <TextField
          variant="box"
          label="상세 주소 (선택)"
          labelOption="sustain"
          placeholder="동, 호수 입력"
          value={detailAddress}
          onChangeText={onDetailAddressChange}
        />
      )}

      {/* 견적 비용 안내 */}
      {selectedAddress && addressEstimateInfo?.hasEstimateFee && (
        <View style={styles.estimateContainer}>
          <Text style={styles.estimateIcon}>⚠️</Text>
          <View style={styles.estimateTextContainer}>
            <Text style={styles.estimateTitle}>도서/원거리 지역</Text>
            <Text style={styles.estimateDescription}>
              추가비용 {addressEstimateInfo.estimateFee?.toLocaleString()}원이 발생할 수 있습니다
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  selectRegionContainer: {
    paddingVertical: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  selectRegionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectRegionSubtitle: {
    fontSize: 14,
    color: colors.grey600,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  estimateContainer: {
    flexDirection: 'row',
    backgroundColor: colors.yellow100,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  estimateIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  estimateTextContainer: {
    flex: 1,
  },
  estimateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.yellow900,
    marginBottom: 4,
  },
  estimateDescription: {
    fontSize: 14,
    color: colors.yellow800,
    lineHeight: 20,
  },
});
