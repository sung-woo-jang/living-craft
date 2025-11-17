import { createRoute, useNavigation } from '@granite-js/react-native';
import { EmptyState } from '@shared/ui/empty-state';
import { colors } from '@toss/tds-colors';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my/reviews', {
  component: Page,
});

interface MyReview {
  id: string;
  serviceId: number;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

const MOCK_REVIEWS: MyReview[] = [
  {
    id: '1',
    serviceId: 1,
    serviceName: '아파트 전체 리모델링',
    rating: 5,
    comment: '처음부터 끝까지 정말 만족스러웠습니다. 꼼꼼하고 친절하게 진행해주셔서 감사합니다.',
    date: '2024-12-10',
  },
  {
    id: '2',
    serviceId: 2,
    serviceName: '주방 리모델링',
    rating: 5,
    comment: '주방이 정말 깔끔하고 예뻐졌어요. 요리하는 게 즐거워졌습니다!',
    date: '2024-12-05',
  },
  {
    id: '3',
    serviceId: 3,
    serviceName: '욕실 리모델링',
    rating: 4,
    comment: '욕실이 넓어 보이고 깨끗해졌어요. 방수 처리도 완벽합니다.',
    date: '2024-11-20',
  },
];

/**
 * 내 리뷰 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/users/me/reviews - 내가 작성한 리뷰 목록 조회
 */
function Page() {
  const navigation = useNavigation();

  if (MOCK_REVIEWS.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>내 리뷰</Text>
          <Text style={styles.subtitle}>작성한 리뷰를 확인하세요</Text>
        </View>
        <EmptyState
          icon="⭐"
          title="작성한 리뷰가 없습니다"
          description="서비스 이용 후 리뷰를 작성해주세요"
          actionLabel="내 예약 보기"
          onActionPress={() => navigation.navigate('/my/reservations')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>내 리뷰</Text>
        <Text style={styles.subtitle}>총 {MOCK_REVIEWS.length}개의 리뷰를 작성했습니다</Text>
      </View>

      {/* 리뷰 목록 */}
      <FlatList
        data={MOCK_REVIEWS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            {/* 서비스 정보 */}
            <TouchableOpacity onPress={() => navigation.navigate('/services/:id', { id: String(item.serviceId) })}>
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

            {/* 작성일 */}
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 16,
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
  date: {
    fontSize: 13,
    color: colors.grey500,
  },
});
