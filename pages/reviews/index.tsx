import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@shared/ui/empty-state';
import { FilterOption, FilterTabs } from '@shared/ui/filter-tabs';

export const Route = createRoute('/reviews', {
  component: Page,
});

interface Review {
  id: string;
  serviceId: number;
  serviceName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: '5', label: '⭐⭐⭐⭐⭐' },
  { key: '4', label: '⭐⭐⭐⭐' },
  { key: '3', label: '⭐⭐⭐' },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '김**',
    rating: 5,
    comment: '처음부터 끝까지 정말 만족스러웠습니다. 꼼꼼하고 친절하게 진행해주셔서 감사합니다.',
    date: '2024-12-10',
  },
  {
    id: '2',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '이**',
    rating: 5,
    comment: '기대 이상이었어요. 디자인 제안도 좋았고 시공 품질도 훌륭했습니다.',
    date: '2024-11-28',
  },
  {
    id: '3',
    serviceId: 2,
    serviceName: '주방 리모델링',
    userName: '최**',
    rating: 5,
    comment: '주방이 정말 깔끔하고 예뻐졌어요. 요리하는 게 즐거워졌습니다!',
    date: '2024-12-05',
  },
  {
    id: '4',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    userName: '박**',
    rating: 4,
    comment: '전반적으로 만족합니다. A/S도 빠르게 대응해주셨어요.',
    date: '2024-11-15',
  },
  {
    id: '5',
    serviceId: 3,
    serviceName: '욕실 리모델링',
    userName: '정**',
    rating: 4,
    comment: '욕실이 넓어 보이고 깨끗해졌어요. 방수 처리도 완벽합니다.',
    date: '2024-11-20',
  },
  {
    id: '6',
    serviceId: 4,
    serviceName: '베란다 확장',
    userName: '한**',
    rating: 5,
    comment: '공간이 훨씬 넓어져서 만족합니다. 단열도 잘 되어있어요.',
    date: '2024-10-30',
  },
  {
    id: '7',
    serviceId: 5,
    serviceName: '도배 / 장판',
    userName: '송**',
    rating: 3,
    comment: '깔끔하게 작업해주셨습니다. 다만 일정이 조금 지연되었어요.',
    date: '2024-10-18',
  },
  {
    id: '8',
    serviceId: 6,
    serviceName: '샤시 / 창호',
    userName: '윤**',
    rating: 5,
    comment: '소음이 확실히 줄어들었어요. 단열 효과도 좋습니다.',
    date: '2024-10-05',
  },
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
    navigation.navigate('/services/:id', { id: String(serviceId) });
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
          icon="💬"
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
                  <Text key={index} style={styles.star}>
                    {index < item.rating ? '⭐' : '☆'}
                  </Text>
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
  list: {
    padding: 16,
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
  star: {
    fontSize: 16,
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
