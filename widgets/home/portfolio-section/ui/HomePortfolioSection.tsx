import { createRoute, Image } from '@granite-js/react-native';
import { usePortfolios } from '@shared/hooks/usePortfolios';
import { Carousel, SectionCard } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Badge, Skeleton } from '@toss/tds-react-native';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 포트폴리오 섹션 - 작업 사례
 * 다양한 서비스 작업 사례를 이미지 카드로 표시
 */
export const HomePortfolioSection = () => {
  const navigation = TempRoute.useNavigation();

  // 홈 페이지에서는 최신 5개만 표시
  const { data: portfoliosResponse, isLoading } = usePortfolios({ limit: 5, page: 1 });

  const portfolios = portfoliosResponse?.data || [];
  const isEmpty = portfolios.length === 0;

  const handlePortfolioPress = (portfolioId: number) => {
    navigation.navigate('/portfolio/:id' as any, { id: String(portfolioId) });
  };

  const handleViewAllPress = () => {
    navigation.navigate('/portfolio' as any);
  };

  return (
    <SectionCard title="작업 사례">
      <SectionCard.Loading isLoading={isLoading}>
        <View style={styles.skeletonCard}>
          <Skeleton width="100%" height={180} borderRadius={0} />
          <View style={styles.cardContent}>
            <Skeleton width={60} height={20} borderRadius={4} />
            <View style={{ height: 8 }} />
            <Skeleton width="70%" height={17} borderRadius={4} />
            <View style={{ height: 6 }} />
            <Skeleton width="90%" height={14} borderRadius={4} />
          </View>
        </View>
        <View style={styles.skeletonIndicator}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width={8} height={8} borderRadius={4} style={{ marginHorizontal: 4 }} />
          ))}
        </View>
      </SectionCard.Loading>

      <SectionCard.Empty isEmpty={isEmpty} message="등록된 작업 사례가 없습니다." />

      <SectionCard.Content>
        <Carousel
          data={portfolios}
          renderItem={(item) => (
            <TouchableOpacity onPress={() => handlePortfolioPress(item.id)}>
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: item.images[0] || undefined }}
                  style={styles.image}
                  onError={() => {
                    console.warn(`Failed to load home portfolio image: ${item.id}`);
                  }}
                />
                <View style={styles.cardContent}>
                  <Badge type="blue" size="small" badgeStyle="weak">
                    {item.category}
                  </Badge>
                  <Text style={styles.cardTitle}>{item.projectName}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          itemWidth={SCREEN_WIDTH - 40}
          itemHeight={320}
          gap={16}
          showIndicator={true}
          dotColor={colors.blue500}
          inactiveDotColor={colors.grey300}
          autoPlay={true}
          autoPlayInterval={4000}
        />

        <TouchableOpacity onPress={handleViewAllPress} style={styles.viewAllButton}>
          <View style={styles.viewAllButtonInner}>
            <Text style={styles.viewAllText}>모든 작업 사례 보기</Text>
          </View>
        </TouchableOpacity>
      </SectionCard.Content>
    </SectionCard>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grey100,
  },
  skeletonIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  carouselItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grey100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.grey100,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.grey900,
    marginTop: 8,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.grey500,
    lineHeight: 20,
  },
  viewAllButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  viewAllButtonInner: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: colors.blue50,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.blue500,
    textAlign: 'center',
  },
});
