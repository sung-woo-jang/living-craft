import { createRoute } from '@granite-js/react-native';
import { EmptyState } from '@shared/ui/empty-state';
import { FilterOption, FilterTabs } from '@shared/ui/filter-tabs';
import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/portfolio', {
  component: Page,
});

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  description: string;
  date: string;
  tags: string[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: 'residential', label: '주거 공간' },
  { key: 'commercial', label: '상업 공간' },
  { key: 'remodeling', label: '리모델링' },
  { key: 'furniture', label: '가구 제작' },
];

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: '모던 아파트 리모델링',
    category: 'residential',
    imageUrl: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Apartment',
    description: '30평대 아파트 전체 리모델링 프로젝트. 오래된 공간을 모던한 감각으로 새롭게 변신.',
    date: '2024-12',
    tags: ['리모델링', '아파트', '모던'],
  },
  {
    id: '2',
    title: '미니멀 오피스 인테리어',
    category: 'commercial',
    imageUrl: 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Office',
    description: '20평 규모의 사무실 공간. 미니멀하고 효율적인 업무 환경 조성.',
    date: '2024-11',
    tags: ['오피스', '미니멀', '상업공간'],
  },
  {
    id: '3',
    title: '빈티지 카페 디자인',
    category: 'commercial',
    imageUrl: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Cafe',
    description: '따뜻한 분위기의 빈티지 감성 카페. 원목과 벽돌을 활용한 인테리어.',
    date: '2024-10',
    tags: ['카페', '빈티지', '상업공간'],
  },
  {
    id: '4',
    title: '북유럽 스타일 주택',
    category: 'residential',
    imageUrl: 'https://via.placeholder.com/400x300/f39c12/ffffff?text=Nordic',
    description: '단독주택 전체 인테리어. 밝고 깨끗한 북유럽 스타일.',
    date: '2024-09',
    tags: ['주택', '북유럽', '화이트'],
  },
  {
    id: '5',
    title: '맞춤 책장 제작',
    category: 'furniture',
    imageUrl: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Bookshelf',
    description: '벽면 전체를 활용한 맞춤 책장. 공간 효율을 극대화한 디자인.',
    date: '2024-08',
    tags: ['가구', '맞춤제작', '수납'],
  },
  {
    id: '6',
    title: '빌라 전체 리노베이션',
    category: 'remodeling',
    imageUrl: 'https://via.placeholder.com/400x300/1abc9c/ffffff?text=Villa',
    description: '30년 된 빌라의 완전한 변신. 구조 변경 및 전체 마감 공사.',
    date: '2024-07',
    tags: ['리노베이션', '빌라', '대공사'],
  },
];

/**
 * 포트폴리오 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/portfolio - 포트폴리오 목록
 * 2. GET /api/portfolio/{id} - 포트폴리오 상세
 */
function Page() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredItems = MOCK_PORTFOLIO.filter((item) => activeFilter === 'all' || item.category === activeFilter);

  const handleItemPress = (item: PortfolioItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>포트폴리오</Text>
        <Text style={styles.subtitle}>우리가 완성한 공간을 확인해보세요</Text>
      </View>

      {/* 필터 */}
      <FilterTabs options={FILTER_OPTIONS} activeKey={activeFilter} onFilterChange={setActiveFilter} />

      {/* 포트폴리오 그리드 */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="📁"
          title="포트폴리오가 없습니다"
          description="선택하신 카테고리에 해당하는 작업 사례가 없습니다"
          actionLabel="전체 보기"
          onActionPress={() => setActiveFilter('all')}
        />
      ) : (
        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 상세 모달 */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
        {selectedItem && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>포트폴리오 상세</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} />

              <View style={styles.modalInfo}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalDate}>{selectedItem.date}</Text>
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                <View style={styles.tagsContainer}>
                  {selectedItem.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey50,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey600,
  },
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.grey200,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: colors.grey600,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.grey700,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
  },
  placeholder: {
    width: 36,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.grey200,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: colors.grey600,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.grey700,
    lineHeight: 24,
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.blue100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: colors.blue600,
    fontWeight: '500',
  },
});
