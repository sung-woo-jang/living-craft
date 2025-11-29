import { FILM_REVIEWS } from '@shared/constants';
import { Card, Carousel } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>입주민이 알려주는 이야기</Text>
      </View>

      <Carousel
        data={FILM_REVIEWS}
        renderItem={(review) => (
          <View style={styles.reviewCard}>
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
        )}
        itemWidth={SCREEN_WIDTH - 40}
        itemHeight={220}
        gap={16}
        showIndicator={true}
        dotColor={colors.blue500}
        inactiveDotColor={colors.grey300}
        autoPlay={true}
        autoPlayInterval={5000}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
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
