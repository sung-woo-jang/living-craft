import { createRoute } from '@granite-js/react-native';
import { HomeContactSection } from '@widgets/home/contact-section';
import { HomeCtaSection } from '@widgets/home/cta-section';
import { HomeHero } from '@widgets/home/hero';
import { HomePortfolioSection } from '@widgets/home/portfolio-section';
import { HomeReviewsSection } from '@widgets/home/reviews-section';
import { HomeServicesSection } from '@widgets/home/services-section';
import { ScrollView, StyleSheet, View } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

/**
 * 홈페이지 - 메인 랜딩 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/services - 주요 서비스 목록 조회
 * 2. GET /api/portfolio - 작업 사례 목록 조회
 * 3. GET /api/reviews - 고객 후기 목록 조회
 */
function Page() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <HomeHero />
        <HomeServicesSection />
        <HomePortfolioSection />
        <HomeReviewsSection />
        <HomeCtaSection />
        <HomeContactSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
});
