import { createRoute, Image } from '@granite-js/react-native';
import { FILM_PORTFOLIOS } from '@shared/constants';
import { Card, Carousel } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 포트폴리오 섹션 - 인테리어 필름 시공 사례
 * 필름 시공 작업 사례를 이미지 카드로 표시
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
        <Text style={styles.title}>시공 사례</Text>
        <Text style={styles.subtitle}>실제 필름 시공으로 변화된 공간들</Text>
      </View>

      <Carousel
        data={FILM_PORTFOLIOS}
        renderItem={(item) => (
          <TouchableOpacity onPress={() => handlePortfolioPress(item.id)}>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
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
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </Card>
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
        <Card style={{ alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 28 }}>
          <Text style={styles.viewAllText}>모든 시공 사례 보기</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grey200,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  category: {
    fontSize: 13,
    color: colors.blue500,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
  },
  viewAllButton: {
    marginTop: 32,
  },
  viewAllText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.blue500,
    textAlign: 'center',
  },
});
