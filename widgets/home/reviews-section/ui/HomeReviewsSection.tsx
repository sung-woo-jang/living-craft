import { useReviews } from '@shared/hooks/useReviews';
import { Card, Carousel } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Asset } from '@toss/tds-react-native';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * 홈페이지 리뷰 섹션 - 서비스 후기
 * 고객 서비스 후기를 카드 형태로 표시
 */
export const HomeReviewsSection = () => {
  // 홈 페이지에서는 최신 5개만 표시
  const { data: reviewsResponse, isLoading } = useReviews({ limit: 5, page: 1 });

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2, marginBottom: 12 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Asset.Icon
            key={index}
            name="icon-star-mono"
            color={index < rating ? colors.yellow500 : colors.grey300}
            frameShape={Asset.frameShape.CleanW24}
          />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.title}>입주민이 알려주는 이야기</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
        </View>
      </Card>
    );
  }

  const reviews = reviewsResponse?.data || [];

  if (reviews.length === 0) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.title}>입주민이 알려주는 이야기</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>등록된 리뷰가 없습니다.</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>입주민이 알려주는 이야기</Text>
      </View>

      <Carousel
        data={reviews}
        renderItem={(review) => (
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{review.customer.name[0]}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{review.customer.name}</Text>
                <Text style={styles.service}>{review.service.title}</Text>
              </View>
            </View>
            {renderStars(review.rating)}
            <Text style={styles.content}>{review.comment}</Text>
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
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.grey600,
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
  content: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 22,
  },
});
