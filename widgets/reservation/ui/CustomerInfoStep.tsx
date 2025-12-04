import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { IconButton, TextField } from '@toss/tds-react-native';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { searchAddress } from '../api';
import { useReservationStore } from '../store';
import { AddressSearchResult, ReservationFormData } from '../types';
import { PhotoSection } from './PhotoSection';

export function CustomerInfoStep() {
  const { control, setValue, watch } = useFormContext<ReservationFormData>();

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

  const [hasSearched, setHasSearched] = useState(false);

  // 현재 주소 값 감시
  const currentAddress = watch('customerInfo.address');
  const currentDetailAddress = watch('customerInfo.detailAddress');

  // 주소가 이미 설정되어 있는지 확인
  const hasAddress = currentAddress && currentAddress.trim() !== '';

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

          <View style={styles.selectedAddressBox}>
            <Text style={styles.selectedAddressLabel}>선택된 주소</Text>
            <Text style={styles.selectedAddressText}>{currentAddress}</Text>
            {currentDetailAddress && <Text style={styles.detailAddressText}>{currentDetailAddress}</Text>}
          </View>

          <TouchableOpacity style={styles.changeAddressButton} onPress={handleChangeAddress}>
            <Text style={styles.changeAddressText}>주소 변경</Text>
          </TouchableOpacity>
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

          <View style={styles.selectedAddressBox}>
            <Text style={styles.selectedAddressLabel}>선택된 주소</Text>
            <Text style={styles.selectedAddressText}>{selectedAddress.roadAddress}</Text>
          </View>

          <DetailAddressInput onConfirm={handleConfirmAddress} />
        </Card>
      );
    }

    // 검색 모드
    return (
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

        {isAddressSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue500} />
          </View>
        ) : hasSearched && addressSearchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
          </View>
        ) : addressSearchResults.length > 0 ? (
          <FlatList
            data={addressSearchResults}
            renderItem={renderAddressItem}
            keyExtractor={(item, index) => `${item.roadAddress}-${index}`}
            style={styles.resultList}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : null}
      </Card>
    );
  };

  return (
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
  // 주소 검색 결과 스타일
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
  detailAddressText: {
    fontSize: 14,
    color: colors.grey700,
    marginTop: 4,
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
  changeAddressButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeAddressText: {
    fontSize: 14,
    color: colors.blue500,
    fontWeight: '500',
  },
});
