import { colors } from '@toss/tds-colors';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import type { RegionData } from '../types';

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  isOpen: boolean;
  regions: RegionData[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (region: RegionData) => void;
}

export function RegionSelectBottomSheet({ isOpen, regions, isLoading, onClose, onSelect }: Props) {
  const sheetRef = useRef<RBSheetRef>(null);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (region: RegionData) => {
      onSelect(region);
    },
    [onSelect]
  );

  return (
    <RBSheet
      ref={sheetRef}
      onClose={onClose}
      height={450}
      openDuration={250}
      closeDuration={200}
      draggable
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: styles.draggableIcon,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>시/도 선택</Text>
        <Text style={styles.headerDescription}>서비스를 받으실 시/도를 선택해주세요</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
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
          regions.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.regionItem} onPress={() => handleSelect(item)}>
                <Text style={styles.regionText}>{item.name}</Text>
              </TouchableOpacity>
              {index < regions.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </ScrollView>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  draggableIcon: {
    backgroundColor: colors.grey300,
    width: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.grey900,
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.grey600,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
