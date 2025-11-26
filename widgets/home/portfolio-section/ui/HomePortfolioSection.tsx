import { createRoute, Image } from '@granite-js/react-native';
import { MOCK_PORTFOLIOS } from '@shared/constants';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 포트폴리오 섹션
 * 주요 작업 사례를 이미지 카드로 표시
 *
 * TODO: GET /api/portfolio - 작업 사례 목록 조회
 */
export const HomePortfolioSection = () => {
  const navigation = TempRoute.useNavigation();

  const handlePortfolioPress = (portfolioId: number) => {
    navigation.navigate('/portfolio/:id' as any, { id: String(portfolioId) });
  };

  const handleViewAllPress = () => {
    navigation.navigate('/portfolio' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>포트폴리오</Text>
        <Text style={styles.subtitle}>우리가 만든 공간을 확인해보세요</Text>
      </View>

      <View style={styles.grid}>
        {MOCK_PORTFOLIOS.slice(0, 4).map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => handlePortfolioPress(item.id)}>
            <Image
              source={{ uri: item.thumbnail || undefined }}
              style={styles.image}
              onError={() => {
                console.warn(`Failed to load home portfolio image: ${item.id}`);
              }}
            />
            <View style={styles.cardContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.cardTitle}>{item.projectName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllPress}>
        <Text style={styles.viewAllText}>모든 포트폴리오 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '48%',
    minWidth: 150,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: colors.grey200,
  },
  cardContent: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: colors.blue500,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
  },
  viewAllButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blue500,
    alignSelf: 'center',
  },
  viewAllText: {
    color: colors.blue500,
    fontSize: 16,
    fontWeight: '600',
  },
});
