import { FILM_REVIEWS } from '@shared/constants';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 홈페이지 리뷰 섹션 - 인테리어 필름 시공 후기
 * 필름 시공 고객 후기를 카드 형태로 표시
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
        <Text style={styles.subtitle}>필름 시공 고객들의 생생한 경험</Text>
      </View>

      <View style={styles.grid}>
        {FILM_REVIEWS.map((review) => (
          <Card key={review.id} style={{ paddingVertical: 16 }}>
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
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: colors.grey600,
    textAlign: 'center',
  },
  grid: {
    gap: 0,
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
    fontSize: 17,
    fontWeight: '600',
    color: colors.blue500,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 2,
  },
  service: {
    fontSize: 13,
    color: colors.grey600,
  },
  stars: {
    fontSize: 17,
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 22,
  },
});
