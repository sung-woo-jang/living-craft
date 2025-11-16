import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, View } from 'react-native';

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  service: string;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    author: '김민수',
    rating: 5,
    content: '완벽한 인테리어 서비스였습니다. 디자이너님이 세심하게 신경써주셔서 만족스러운 결과를 얻었어요.',
    service: '홈 스타일링',
  },
  {
    id: '2',
    author: '이지은',
    rating: 5,
    content: '기대 이상이었습니다. 맞춤 가구가 공간에 딱 맞아서 너무 좋아요. 추천합니다!',
    service: '가구 제작',
  },
  {
    id: '3',
    author: '박준영',
    rating: 4,
    content: '오래된 사무실이 완전히 새롭게 바뀌었어요. 직원들 모두 만족하고 있습니다.',
    service: '리모델링',
  },
];

/**
 * 홈페이지 리뷰 섹션
 * 고객 후기를 카드 형태로 표시
 *
 * TODO: GET /api/reviews - 고객 후기 목록 조회
 */
export const HomeReviewsSection = () => {
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>고객 후기</Text>
        <Text style={styles.subtitle}>고객들의 생생한 경험을 들어보세요</Text>
      </View>

      <View style={styles.grid}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{review.author[0]}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{review.author}</Text>
                <Text style={styles.service}>{review.service}</Text>
              </View>
            </View>
            <Text style={styles.stars}>{renderStars(review.rating)}</Text>
            <Text style={styles.content}>{review.content}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey600,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.blue500,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 2,
  },
  service: {
    fontSize: 13,
    color: colors.grey600,
  },
  stars: {
    fontSize: 18,
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 22,
  },
});
