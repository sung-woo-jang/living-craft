import { colors } from '@toss/tds-colors';
import { BottomSheet, IconButton } from '@toss/tds-react-native';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { CityData, RegionData } from '../types';

interface Props {
  isOpen: boolean;
  selectedRegion: RegionData | null;
  cities: CityData[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (city: CityData) => void;
  onBackToRegion: () => void;
}

export function CitySelectBottomSheet({ isOpen, selectedRegion, cities, isLoading, onClose, onSelect, onBackToRegion }: Props) {
  const renderCityItem = useCallback(
    ({ item }: { item: CityData }) => (
      <TouchableOpacity style={styles.cityItem} onPress={() => onSelect(item)}>
        <Text style={styles.cityText}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [onSelect]
  );

  const handleBackPress = useCallback(() => {
    onClose();
    // 약간의 딜레이 후 시/도 선택 바텀시트 오픈
    setTimeout(() => {
      onBackToRegion();
    }, 300);
  }, [onClose, onBackToRegion]);

  return (
    <BottomSheet.Root
      open={isOpen}
      onClose={onClose}
      header={
        <View style={styles.headerContainer}>
          <IconButton name="icon-arrow-back-ios-mono" onPress={handleBackPress} accessibilityLabel="시/도 재선택" />
          <View style={styles.headerContent}>
            <BottomSheet.Header>구/군 선택</BottomSheet.Header>
          </View>
        </View>
      }
      headerDescription={
        selectedRegion ? (
          <BottomSheet.HeaderDescription>{`${selectedRegion.name}의 구/군을 선택해주세요`}</BottomSheet.HeaderDescription>
        ) : undefined
      }
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
          <Text style={styles.loadingText}>구/군 정보를 불러오는 중...</Text>
        </View>
      ) : cities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>해당 지역에 서비스 가능한 구/군이 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {cities.map((item) => (
            <View key={item.id}>
              {renderCityItem({ item })}
              {cities.indexOf(item) < cities.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      )}
    </BottomSheet.Root>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerContent: {
    flex: 1,
  },
  list: {
    maxHeight: 400,
  },
  cityItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  cityText: {
    fontSize: 16,
    color: colors.grey900,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey200,
    marginHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.grey600,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey600,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
