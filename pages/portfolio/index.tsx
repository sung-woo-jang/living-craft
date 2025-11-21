import { createRoute } from '@granite-js/react-native';
import { Portfolio, PortfolioCard } from '@shared/ui/portfolio-card';
import { colors } from '@toss/tds-colors';
import { FlatList, StyleSheet, View } from 'react-native';

export const Route = createRoute('/portfolio', {
  component: Page,
});

const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 1,
    projectName: '강남 아파트 전체 리모델링',
    client: '김○○',
    duration: '2024.10 - 2024.12',
    category: '주거공간',
    thumbnail: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Apartment1',
    description: '30평대 아파트 전체 리모델링. 모던하고 깔끔한 공간으로 재탄생',
  },
  {
    id: 2,
    projectName: '카페 인테리어 프로젝트',
    client: '○○카페',
    duration: '2024.09 - 2024.10',
    category: '상업공간',
    thumbnail: 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Cafe',
    description: '빈티지 감성의 카페 인테리어. 따뜻하고 아늑한 분위기 연출',
  },
  {
    id: 3,
    projectName: '사무실 리노베이션',
    client: '○○기업',
    duration: '2024.08 - 2024.09',
    category: '상업공간',
    thumbnail: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Office',
    description: '20평 규모 사무실 공간. 효율적이고 쾌적한 업무 환경 구축',
  },
  {
    id: 4,
    projectName: '북유럽 스타일 주택',
    client: '이○○',
    duration: '2024.07 - 2024.09',
    category: '주거공간',
    thumbnail: 'https://via.placeholder.com/400x300/f39c12/ffffff?text=House',
    description: '단독주택 전체 인테리어. 밝고 따뜻한 북유럽 스타일 적용',
  },
  {
    id: 5,
    projectName: '맞춤 가구 제작 프로젝트',
    client: '박○○',
    duration: '2024.06 - 2024.07',
    category: '가구제작',
    thumbnail: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Furniture',
    description: '거실 전체를 활용한 맞춤 수납장. 공간 효율 극대화',
  },
  {
    id: 6,
    projectName: '빌라 전체 리노베이션',
    client: '최○○',
    duration: '2024.04 - 2024.06',
    category: '리모델링',
    thumbnail: 'https://via.placeholder.com/400x300/1abc9c/ffffff?text=Villa',
    description: '30년 된 빌라의 완전한 변신. 구조 변경부터 마감까지',
  },
  {
    id: 7,
    projectName: '펜트하우스 인테리어',
    client: '정○○',
    duration: '2024.03 - 2024.05',
    category: '주거공간',
    thumbnail: 'https://via.placeholder.com/400x300/34495e/ffffff?text=Penthouse',
    description: '고급스러운 펜트하우스 인테리어. 럭셔리 모던 스타일',
  },
  {
    id: 8,
    projectName: '레스토랑 디자인',
    client: '○○레스토랑',
    duration: '2024.01 - 2024.03',
    category: '상업공간',
    thumbnail: 'https://via.placeholder.com/400x300/95a5a6/ffffff?text=Restaurant',
    description: '30석 규모 레스토랑. 우아하고 세련된 분위기의 다이닝 공간',
  },
];

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
  },
});
