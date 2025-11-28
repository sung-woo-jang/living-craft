import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { HomeContactSection } from '@widgets/home/contact-section';
import { HomeFilmShowcaseSection } from '@widgets/home/film-showcase-section';
import { HomeHero } from '@widgets/home/hero';
import { HomePortfolioSection } from '@widgets/home/portfolio-section';
import { HomeReviewsSection } from '@widgets/home/reviews-section';
import { ScrollView, StyleSheet, View } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

/**
 * 홈페이지 - 인테리어 필름 전문 랜딩 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/film-showcase - 필름 시공 이미지 목록 조회
 * 2. GET /api/portfolio - 작업 사례 목록 조회 (필름 시공)
 * 3. GET /api/reviews - 고객 후기 목록 조회 (필름 시공)
 */
function Page() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <HomeHero />
        <HomeFilmShowcaseSection />
        <HomePortfolioSection />
        <HomeReviewsSection />
        <HomeContactSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
});
