import { colors } from '@toss/tds-colors';
import { BottomSheet } from '@toss/tds-react-native';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { RegionData } from '../types';

interface Props {
  isOpen: boolean;
  regions: RegionData[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (region: RegionData) => void;
}

export function RegionSelectBottomSheet({ isOpen, regions, isLoading, onClose, onSelect }: Props) {
  const renderRegionItem = useCallback(
    ({ item }: { item: RegionData }) => (
      <TouchableOpacity style={styles.regionItem} onPress={() => onSelect(item)}>
        <Text style={styles.regionText}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [onSelect]
  );

  return (
    <BottomSheet.Root
      open={isOpen}
      onClose={onClose}
      header={<BottomSheet.Header>시/도 선택</BottomSheet.Header>}
      headerDescription={<BottomSheet.HeaderDescription>서비스를 받으실 시/도를 선택해주세요</BottomSheet.HeaderDescription>}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
          <Text style={styles.loadingText}>지역 정보를 불러오는 중...</Text>
        </View>
      ) : regions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>사용 가능한 지역이 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {regions.map((item) => (
            <View key={item.id}>
              {renderRegionItem({ item })}
              {regions.indexOf(item) < regions.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      )}
    </BottomSheet.Root>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 400,
  },
  regionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  regionText: {
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
  },
});
