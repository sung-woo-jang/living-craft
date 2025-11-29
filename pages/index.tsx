import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { HomePortfolioSection } from '@widgets/home/portfolio-section';
import { HomePromoCarouselSection } from '@widgets/home/promo-carousel-section';
import { HomeReviewsSection } from '@widgets/home/reviews-section';
import { HomeServicesSection } from '@widgets/home/services-section';
import { ScrollView, StyleSheet, View } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

/**
 * 홈페이지 - 짐싸 스타일 서비스 랜딩 페이지
 *
 * 구조:
 * 1. 프로모션 캐러셀 - 이벤트/혜택 안내
 * 2. 서비스 목록 - 인테리어 필름, 유리청소 등
 * 3. 시공 사례 - 포트폴리오 이미지
 * 4. 고객 후기 - 리뷰 캐러셀
 */
function Page() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <HomePromoCarouselSection />
        <HomeServicesSection />
        <HomePortfolioSection />
        <HomeReviewsSection />
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
    backgroundColor: colors.greyBackground,
  },
  scrollContent: {
    backgroundColor: colors.greyBackground,
  },
});
