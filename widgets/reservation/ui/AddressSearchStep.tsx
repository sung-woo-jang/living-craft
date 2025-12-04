import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Button, IconButton, TextField } from '@toss/tds-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { searchAddress } from '../api/naverLocalSearch';
import { useReservationStore } from '../store/reservationStore';
import { AddressSearchResult, ReservationFormData } from '../types';

interface AddressSearchStepProps {
  onAddressConfirmed?: () => void;
}

export function AddressSearchStep({ onAddressConfirmed }: AddressSearchStepProps) {
  const { setValue } = useFormContext<ReservationFormData>();

  const {
    addressSearchQuery,
    addressSearchResults,
    isAddressSearching,
    showAddressDetailInput,
    selectedAddress,
    setAddressSearchQuery,
    setAddressSearchResults,
    setIsAddressSearching,
    selectAddress,
    resetAddressSearch,
  } = useReservationStore([
    'addressSearchQuery',
    'addressSearchResults',
    'isAddressSearching',
    'showAddressDetailInput',
    'selectedAddress',
    'setAddressSearchQuery',
    'setAddressSearchResults',
    'setIsAddressSearching',
    'selectAddress',
    'resetAddressSearch',
  ]);

  const [detailAddress, setDetailAddress] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    return () => {
      // 언마운트 시 초기화하지 않음 (페이지 이동 시 상태 유지)
    };
  }, []);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      const query = searchQuery ?? addressSearchQuery;
      if (!query.trim()) {
        return;
      }

      Keyboard.dismiss();
      setIsAddressSearching(true);
      setHasSearched(true);

      try {
        const results = await searchAddress(query);
        setAddressSearchResults(results);
      } catch (error) {
        console.error('주소 검색 오류:', error);
        setAddressSearchResults([]);
      } finally {
        setIsAddressSearching(false);
      }
    },
    [addressSearchQuery, setIsAddressSearching, setAddressSearchResults]
  );

  const handleAddressSelect = useCallback(
    (address: AddressSearchResult) => {
      selectAddress(address);
      setDetailAddress('');
    },
    [selectAddress]
  );

  const handleConfirm = useCallback(() => {
    if (!selectedAddress || !detailAddress.trim()) {
      return;
    }

    // 폼 데이터 업데이트
    setValue('customerInfo.address', selectedAddress.roadAddress);
    setValue('customerInfo.detailAddress', detailAddress.trim());

    // 콜백 호출
    onAddressConfirmed?.();
  }, [selectedAddress, detailAddress, setValue, onAddressConfirmed]);

  const handleBack = useCallback(() => {
    resetAddressSearch();
  }, [resetAddressSearch]);

  const renderAddressItem = useCallback(
    ({ item }: { item: AddressSearchResult }) => (
      <TouchableOpacity style={styles.addressItem} onPress={() => handleAddressSelect(item)}>
        {item.zipCode && (
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>우편번호</Text>
            <Text style={styles.addressValue}>{item.zipCode}</Text>
          </View>
        )}
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>도로명</Text>
          <Text style={styles.addressValue}>{item.roadAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>구주소</Text>
          <Text style={styles.addressValue}>{item.jibunAddress}</Text>
        </View>
      </TouchableOpacity>
    ),
    [handleAddressSelect]
  );

  // 상세 주소 입력 화면
  if (showAddressDetailInput && selectedAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.detailHeader}>
          <IconButton
            name="icon-arrow-back-ios-mono"
            onPress={handleBack}
            accessibilityLabel="뒤로 가기"
          />
          <Text style={styles.detailTitle}>자세한 주소를 알려주세요</Text>
        </View>

        <View style={styles.detailContent}>
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>상세 주소 입력</Text>
              <Text style={styles.sectionSubtitle}>상세 주소를 입력해주세요</Text>
            </View>

            <View style={styles.selectedAddressBox}>
              <Text style={styles.selectedAddressLabel}>선택된 주소</Text>
              <Text style={styles.selectedAddressText}>{selectedAddress.roadAddress}</Text>
            </View>

            <TextField
              variant="box"
              label="상세 주소 *"
              placeholder="상세주소를 입력해주세요 (예: 우리푸름빌 402호)"
              value={detailAddress}
              onChangeText={setDetailAddress}
            />
          </Card>
        </View>

        <View style={styles.confirmButtonContainer}>
          <Button
            display="full"
            containerStyle={styles.confirmButton}
            disabled={!detailAddress.trim()}
            onPress={handleConfirm}
          >
            확인
          </Button>
        </View>
      </View>
    );
  }

  // 검색 화면
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>주소 검색</Text>
            <Text style={styles.sectionSubtitle}>서비스를 받으실 주소를 검색해주세요</Text>
          </View>

          <TextField
            variant="box"
            label="주소 *"
            placeholder="건물, 지번 또는 도로명 검색"
            value={addressSearchQuery}
            onChangeText={setAddressSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
        </Card>
      </View>

      {isAddressSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
        </View>
      ) : hasSearched && addressSearchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
        </View>
      ) : (
        <FlatList
          data={addressSearchResults}
          renderItem={renderAddressItem}
          keyExtractor={(item, index) => `${item.roadAddress}-${index}`}
          style={styles.resultList}
          contentContainerStyle={styles.resultListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  searchSection: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey600,
  },
  resultList: {
    flex: 1,
  },
  resultListContent: {
    paddingHorizontal: 16,
  },
  addressItem: {
    paddingVertical: 16,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  addressLabel: {
    width: 60,
    fontSize: 14,
    color: colors.grey500,
  },
  addressValue: {
    flex: 1,
    fontSize: 14,
    color: colors.grey900,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey200,
  },
  // 상세 주소 입력 화면 스타일
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  detailContent: {
    flex: 1,
    padding: 16,
  },
  selectedAddressBox: {
    backgroundColor: colors.grey100,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedAddressLabel: {
    fontSize: 12,
    color: colors.grey600,
    marginBottom: 4,
  },
  selectedAddressText: {
    fontSize: 16,
    color: colors.grey900,
  },
  confirmButtonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  confirmButton: {
    borderRadius: 8,
  },
});
