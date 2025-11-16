import { colors } from '@toss/tds-colors';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: '모던 아파트 리모델링',
    category: '리모델링',
    imageUrl: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Portfolio+1',
  },
  {
    id: '2',
    title: '미니멀 오피스 인테리어',
    category: '상업 공간',
    imageUrl: 'https://via.placeholder.com/300x200/2ecc71/ffffff?text=Portfolio+2',
  },
  {
    id: '3',
    title: '빈티지 카페 디자인',
    category: '상업 공간',
    imageUrl: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Portfolio+3',
  },
  {
    id: '4',
    title: '북유럽 스타일 주택',
    category: '홈 스타일링',
    imageUrl: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Portfolio+4',
  },
];

/**
 * 홈페이지 포트폴리오 섹션
 * 주요 작업 사례를 이미지 카드로 표시
 *
 * TODO: GET /api/portfolio - 작업 사례 목록 조회
 */
export const HomePortfolioSection = () => {
  const handlePortfolioPress = (portfolioId: string) => {
    // TODO: 포트폴리오 모달 열기
    console.log('포트폴리오 클릭:', portfolioId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>포트폴리오</Text>
        <Text style={styles.subtitle}>우리가 만든 공간을 확인해보세요</Text>
      </View>

      <View style={styles.grid}>
        {PORTFOLIO_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handlePortfolioPress(item.id)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>모든 포트폴리오 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey50,
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
