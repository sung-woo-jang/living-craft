import { Image } from '@granite-js/react-native';
import { FILM_SHOWCASE_IMAGES } from '@shared/constants';
import { Card, Carousel } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * 홈페이지 인테리어 필름 쇼케이스 섹션
 * 필름 시공 이미지 캐러셀과 주요 특징 표시
 */
export const HomeFilmShowcaseSection = () => {
  return (
    <Card>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>인테리어 필름 시공</Text>
        <Text style={styles.subtitle}>낡은 공간을 새 집처럼 변화시키는 마법</Text>
      </View>

      {/* 이미지 캐러셀 */}
      <Carousel
        data={FILM_SHOWCASE_IMAGES}
        renderItem={(item) => (
          <View style={styles.carouselItem}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              onError={() => {
                console.warn(`Failed to load film showcase image: ${item.id}`);
              }}
            />
            <View style={styles.caption}>
              <Text style={styles.captionTitle}>{item.title}</Text>
              <Text style={styles.captionDesc}>{item.description}</Text>
            </View>
          </View>
        )}
        itemWidth={SCREEN_WIDTH - 40}
        itemHeight={400}
        gap={16}
        showIndicator={true}
        dotColor={colors.blue500}
        inactiveDotColor={colors.grey300}
        autoPlay={true}
        autoPlayInterval={4000}
      />

      {/* 특징 섹션 */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>왜 인테리어 필름인가요?</Text>
        {[
          { icon: '💰', title: '합리적인 비용', desc: '전면 교체 대비 50-70% 절감' },
          { icon: '⏱️', title: '빠른 시공', desc: '1-2일 내 완성' },
          { icon: '♻️', title: '친환경', desc: '기존 자재 재활용' },
          { icon: '✨', title: '다양한 디자인', desc: '수백 가지 패턴과 색상' },
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
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
    lineHeight: 24,
  },
  carouselItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: colors.grey100,
  },
  caption: {
    padding: 16,
  },
  captionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  captionDesc: {
    fontSize: 13,
    color: colors.grey600,
  },
  features: {
    marginTop: 48,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: 15,
    color: colors.grey600,
  },
});
