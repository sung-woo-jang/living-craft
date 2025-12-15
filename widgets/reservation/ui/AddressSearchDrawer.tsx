import { colors } from '@toss/tds-colors';
import { Skeleton, TextField } from '@toss/tds-react-native';
import { searchAddress } from '@widgets/reservation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import type { AddressSearchResult } from '../types';

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  isOpen: boolean;
  regionPrefix: string;
  onClose: () => void;
  onSelect: (address: AddressSearchResult) => void;
}

export function AddressSearchDrawer({ isOpen, regionPrefix, onClose, onSelect }: Props) {
  const sheetRef = useRef<RBSheetRef>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  // Drawer가 닫힐 때 상태 초기화
  const handleClose = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  }, [onClose]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      return;
    }

    Keyboard.dismiss();
    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await searchAddress(searchQuery, regionPrefix);
      setSearchResults(results);
    } catch (error) {
      console.error('주소 검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, regionPrefix]);

  const handleSelect = useCallback(
    (address: AddressSearchResult) => {
      onSelect(address);
      // 상태 초기화 후 닫기
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    },
    [onSelect]
  );

  return (
    <RBSheet
      ref={sheetRef}
      onClose={handleClose}
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
        <Text style={styles.headerTitle}>주소 검색</Text>
        <Text style={styles.headerDescription}>건물명, 도로명 또는 지번으로 검색하세요</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextField
          variant="box"
          placeholder="예: 숙골로 123, 논현동"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.skeletonItem}>
                <Skeleton width="85%" height={16} borderRadius={4} />
                <View style={{ height: 6 }} />
                <Skeleton width="30%" height={13} borderRadius={4} />
                <View style={{ height: 4 }} />
                <Skeleton width="70%" height={14} borderRadius={4} />
              </View>
            ))}
          </View>
        ) : hasSearched && searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            <Text style={styles.emptySubtext}>다른 검색어로 다시 시도해주세요</Text>
          </View>
        ) : searchResults.length > 0 ? (
          searchResults.map((item, index) => (
            <View key={`${item.roadAddress}-${index}`}>
              <TouchableOpacity style={styles.addressItem} onPress={() => handleSelect(item)}>
                <Text style={styles.addressTitle} numberOfLines={1}>
                  {item.roadAddress}
                </Text>
                {item.zipCode && <Text style={styles.addressZipCode}>[{item.zipCode}]</Text>}
                <Text style={styles.addressJibun} numberOfLines={1}>
                  {item.jibunAddress}
                </Text>
              </TouchableOpacity>
              {index < searchResults.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        ) : (
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>검색어를 입력하고 검색 버튼을 눌러주세요</Text>
          </View>
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
    paddingBottom: 12,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  skeletonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey600,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey500,
  },
  guideContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 14,
    color: colors.grey500,
  },
  addressItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  addressTitle: {
    fontSize: 16,
    color: colors.grey900,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressZipCode: {
    fontSize: 13,
    color: colors.grey500,
    marginBottom: 2,
  },
  addressJibun: {
    fontSize: 14,
    color: colors.grey600,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey200,
    marginHorizontal: 20,
  },
});
