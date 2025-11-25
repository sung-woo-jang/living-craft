import { createRoute } from '@granite-js/react-native';
import { MOCK_PORTFOLIOS } from '@shared/constants';
import { PortfolioCard } from '@shared/ui/portfolio-card';
import { colors } from '@toss/tds-colors';
import { FlatList, StyleSheet, View } from 'react-native';

export const Route = createRoute('/portfolio', {
  component: Page,
});

/**
 * 포트폴리오 목록 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/portfolios - 포트폴리오 목록 조회
 * 2. GET /api/portfolios/category/{category} - 카테고리별 필터링
 */
function Page() {
  const navigation = Route.useNavigation();

  const handlePortfolioPress = (portfolioId: number) => {
    navigation.navigate('/portfolio/:id' as any, { id: String(portfolioId) });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_PORTFOLIOS}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PortfolioCard portfolio={item} onPress={handlePortfolioPress} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
});
