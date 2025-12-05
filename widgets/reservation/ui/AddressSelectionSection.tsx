import { colors } from '@toss/tds-colors';
import { Button, TextField } from '@toss/tds-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { searchAddress } from '../api';
import { useReservationStore } from '../store';
import type { AddressSearchResult } from '../types';

interface Props {
  onAddressSelect: (address: AddressSearchResult) => void;
}

export function AddressSelectionSection({ onAddressSelect }: Props) {
  const {
    addressSelection,
    addressSearchQuery,
    addressSearchResults,
    isAddressSearching,
    setAddressSearchQuery,
    setAddressSearchResults,
    setIsAddressSearching,
    setIsRegionBottomSheetOpen,
    resetRegionSelection,
  } = useReservationStore([
    'addressSelection',
    'addressSearchQuery',
    'addressSearchResults',
    'isAddressSearching',
    'setAddressSearchQuery',
    'setAddressSearchResults',
    'setIsAddressSearching',
    'setIsRegionBottomSheetOpen',
    'resetRegionSelection',
  ]);

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      const query = searchQuery ?? addressSearchQuery;
      if (!query.trim()) {
        return;
      }

      // 선택된 지역 정보 기반으로 검색
      const { region, city } = addressSelection;
      const regionPrefix = city ? `${region?.name} ${city.name}` : region?.name || '인천';

      Keyboard.dismiss();
      setIsAddressSearching(true);
      setHasSearched(true);

      try {
        const results = await searchAddress(query, regionPrefix);
        setAddressSearchResults(results);
      } catch (error) {
        console.error('주소 검색 오류:', error);
        setAddressSearchResults([]);
      } finally {
        setIsAddressSearching(false);
      }
    },
    [addressSearchQuery, addressSelection, setIsAddressSearching, setAddressSearchResults]
  );

  const handleOpenRegionSheet = useCallback(() => {
    setIsRegionBottomSheetOpen(true);
  }, [setIsRegionBottomSheetOpen]);

  const handleChangeRegion = useCallback(() => {
    resetRegionSelection();
    setAddressSearchQuery('');
    setAddressSearchResults([]);
    setHasSearched(false);
    setIsRegionBottomSheetOpen(true);
  }, [resetRegionSelection, setAddressSearchQuery, setAddressSearchResults, setIsRegionBottomSheetOpen]);

  const renderAddressItem = useCallback(
    ({ item }: { item: AddressSearchResult }) => (
      <TouchableOpacity style={styles.addressItem} onPress={() => onAddressSelect(item)}>
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
    [onAddressSelect]
  );

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

  // 시/도 + 구/군 모두 선택된 경우: 주소 검색 UI
  return (
    <>
      <View style={styles.selectedRegionContainer}>
        <View style={styles.selectedRegionTag}>
          <Text style={styles.selectedRegionText}>
            {addressSelection.region.name} {addressSelection.city.name}
          </Text>
          <TouchableOpacity onPress={handleChangeRegion} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextField
        variant="box"
        label="주소 검색 *"
        labelOption="sustain"
        placeholder="건물, 지번 또는 도로명 검색"
        value={addressSearchQuery}
        onChangeText={setAddressSearchQuery}
        onSubmitEditing={() => handleSearch()}
        returnKeyType="search"
      />

      {isAddressSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
        </View>
      ) : hasSearched && addressSearchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
        </View>
      ) : addressSearchResults.length > 0 ? (
        <View style={styles.resultList}>
          {addressSearchResults.map((item, index) => (
            <View key={`${item.roadAddress}-${index}`}>
              {renderAddressItem({ item })}
              {index < addressSearchResults.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      ) : null}
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
  selectedRegionContainer: {
    marginBottom: 16,
  },
  selectedRegionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedRegionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.blue700,
  },
  changeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.blue600,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey600,
  },
  resultList: {
    maxHeight: 300,
    marginTop: 16,
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
});
