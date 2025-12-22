import { createRoute, Image } from '@granite-js/react-native';
import { usePortfolios } from '@shared/hooks/usePortfolios';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/portfolio', {
  component: Page,
});

/**
 * 포트폴리오 목록 페이지 - 짐싸 스타일
 */
function Page() {
  const navigation = Route.useNavigation();

  const { data: portfoliosResponse, isLoading } = usePortfolios();

  const handlePortfolioPress = (portfolioId: number) => {
    navigation.navigate('/portfolio/:id' as any, { id: String(portfolioId) });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue500} />
          <Text style={styles.loadingText}>포트폴리오를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  const portfolios = portfoliosResponse?.data || [];

  if (portfolios.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>작업 사례</Text>
              <Text style={styles.sectionSubtitle}>다양한 작업 사례를 확인해보세요</Text>
            </View>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 포트폴리오가 없습니다.</Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>작업 사례</Text>
            <Text style={styles.sectionSubtitle}>다양한 작업 사례를 확인해보세요</Text>
          </View>

          {portfolios.map((portfolio, index) => (
            <TouchableOpacity
              key={portfolio.id}
              style={[styles.portfolioRow, index < portfolios.length - 1 && styles.portfolioRowBorder]}
              onPress={() => handlePortfolioPress(portfolio.id)}
            >
              <Image
                source={{ uri: portfolio.images[0] || undefined }}
                style={styles.thumbnail}
                onError={() => {
                  console.warn(`Failed to load portfolio thumbnail: ${portfolio.id}`);
                }}
              />

              <View style={styles.portfolioInfo}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{portfolio.category}</Text>
                </View>
                <Text style={styles.portfolioTitle}>{portfolio.projectName}</Text>
                <Text style={styles.portfolioDescription} numberOfLines={2}>
                  {portfolio.description}
                </Text>
                {portfolio.duration ? <Text style={styles.portfolioDuration}>{portfolio.duration}</Text> : null}
              </View>

              <View style={styles.arrowIcon}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    // 하단 여백은 PublicLayout에서 자동 처리
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: colors.grey600,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.grey600,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.grey600,
  },

  // Portfolio Row
  portfolioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  portfolioRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.grey200,
    marginRight: 16,
  },
  portfolioInfo: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.blue600,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  portfolioDescription: {
    fontSize: 13,
    color: colors.grey600,
    lineHeight: 18,
    marginBottom: 4,
  },
  portfolioDuration: {
    fontSize: 12,
    color: colors.grey400,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: colors.grey400,
  },
});
