import { createRoute, useNavigation } from '@granite-js/react-native';
import { MOCK_REVIEWS } from '@shared/constants';
import { EmptyState } from '@shared/ui/empty-state';
import { FilterOption, FilterTabs } from '@shared/ui/filter-tabs';
import { colors } from '@toss/tds-colors';
import { Asset } from '@toss/tds-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/reviews', {
  component: Page,
});

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: '5', label: '5점' },
  { key: '4', label: '4점' },
  { key: '3', label: '3점' },
];

/**
 * 리뷰 목록 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/reviews - 리뷰 목록 조회 (필터링 지원)
 */
function Page() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReviews = MOCK_REVIEWS.filter((review) => {
    if (activeFilter === 'all') return true;
    return review.rating === parseInt(activeFilter);
  });

  const handleServicePress = (serviceId: number) => {
    navigation.navigate('/portfolio/:id', { id: String(serviceId) });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>고객 리뷰</Text>
        <Text style={styles.subtitle}>실제 이용 고객님들의 솔직한 후기</Text>
      </View>

      {/* 필터 */}
      <FilterTabs options={FILTER_OPTIONS} activeKey={activeFilter} onFilterChange={setActiveFilter} />

      {/* 리뷰 목록 */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          iconName="icon-chat-bubble-mono"
          title="리뷰가 없습니다"
          description="선택하신 평점에 해당하는 리뷰가 없습니다"
          actionLabel="전체 보기"
          onActionPress={() => setActiveFilter('all')}
        />
      ) : (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              {/* 서비스 정보 */}
              <TouchableOpacity onPress={() => handleServicePress(item.serviceId)}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
              </TouchableOpacity>

              {/* 평점 */}
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Asset.Icon
                    key={index}
                    name="icon-star-mono"
                    color={index < item.rating ? colors.yellow500 : colors.grey300}
                    frameShape={Asset.frameShape.CleanW24}
                  />
                ))}
                <Text style={styles.ratingText}>{item.rating}.0</Text>
              </View>

              {/* 리뷰 내용 */}
              <Text style={styles.comment}>{item.comment}</Text>

              {/* 작성자 및 날짜 */}
              <View style={styles.footer}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  list: {
    padding: 16,
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.blue600,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey700,
    marginLeft: 6,
  },
  comment: {
    fontSize: 15,
    color: colors.grey800,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey100,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey700,
  },
  date: {
    fontSize: 13,
    color: colors.grey500,
  },
});
