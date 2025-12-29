import { colors } from '@toss/tds-colors';
import { IconButton, Skeleton } from '@toss/tds-react-native';
import type { CityData, RegionData } from '@types';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  isOpen: boolean;
  selectedRegion: RegionData | null;
  cities: CityData[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (city: CityData) => void;
  onBackToRegion: () => void;
}

export function CitySelectBottomSheet({
  isOpen,
  selectedRegion,
  cities,
  isLoading,
  onClose,
  onSelect,
  onBackToRegion,
}: Props) {
  const sheetRef = useRef<RBSheetRef>(null);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSelect = (city: CityData) => {
    onSelect(city);
  };

  const handleBackPress = () => {
    sheetRef.current?.close();
    setTimeout(() => {
      onBackToRegion();
    }, 300);
  };

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
        <View style={styles.headerRow}>
          <IconButton name="icon-arrow-back-ios-mono" onPress={handleBackPress} accessibilityLabel="시/도 재선택" />
          <Text style={styles.headerTitle}>구/군 선택</Text>
        </View>
        {selectedRegion && <Text style={styles.headerDescription}>{`${selectedRegion.name}의 구/군을 선택해주세요`}</Text>}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={styles.skeletonItem}>
                <Skeleton width="50%" height={16} borderRadius={4} />
              </View>
            ))}
          </View>
        ) : cities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 지역에 서비스 가능한 구/군이 없습니다.</Text>
          </View>
        ) : (
          cities.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.cityItem} onPress={() => handleSelect(item)}>
                <Text style={styles.cityText}>{item.name}</Text>
              </TouchableOpacity>
              {index < cities.length - 1 && <View style={styles.separator} />}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.grey900,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.grey600,
    marginTop: 4,
    marginLeft: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skeletonItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
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
