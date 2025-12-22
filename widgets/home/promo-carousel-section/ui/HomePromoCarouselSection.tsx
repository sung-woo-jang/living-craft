import { createRoute } from '@granite-js/react-native';
import type { Promotion } from '@shared/api/types';
import { useIncrementPromotionClick, usePromotions } from '@shared/hooks';
import { Card } from '@shared/ui/card';
import { Carousel } from '@shared/ui/carousel';
import { colors } from '@toss/tds-colors';
import { Skeleton } from '@toss/tds-react-native';
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = 10;
const CARD_HORIZONTAL_PADDING = 8;
const CAROUSEL_WIDTH = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2) - (CARD_HORIZONTAL_PADDING * 2);

// 네비게이션 훅 사용을 위한 임시 라우트
const TempRoute = createRoute('/_layout' as any, { component: () => null });

export const HomePromoCarouselSection = () => {
  const navigation = TempRoute.useNavigation();
  const { data: promotions, isLoading } = usePromotions();
  const { mutate: incrementClick } = useIncrementPromotionClick();

  // 프로모션 배너가 없으면 렌더링하지 않음
  if (!isLoading && (!promotions || promotions.length === 0)) {
    return null;
  }

  const handlePromoPress = async (item: Promotion) => {
    // 1. 클릭 통계 API 호출 (비동기, 에러 무시)
    incrementClick(item.id);

    // 2. 링크 타입에 따른 이동
    if (!item.linkUrl) return;

    if (item.linkType === 'external') {
      try {
        await Linking.openURL(item.linkUrl);
      } catch (error) {
        console.error('외부 링크 열기 실패:', error);
      }
    } else if (item.linkType === 'internal') {
      navigation.navigate(item.linkUrl as any);
    }
  };

  const renderPromoItem = (item: Promotion) => {
    return (
      <TouchableOpacity
        style={styles.promoItem}
        onPress={() => handlePromoPress(item)}
        activeOpacity={item.linkUrl ? 0.7 : 1}
      >
        {item.iconUrl && (
          <Image source={{ uri: item.iconUrl }} style={styles.promoIcon} />
        )}
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Card>
        <View style={styles.loadingContainer}>
          <Skeleton width={56} height={56} borderRadius={8} />
          <View style={styles.loadingTextContainer}>
            <Skeleton width="70%" height={16} borderRadius={4} />
            <View style={{ height: 6 }} />
            <Skeleton width="50%" height={14} borderRadius={4} />
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Carousel
        data={promotions ?? []}
        renderItem={renderPromoItem}
        itemWidth={CAROUSEL_WIDTH}
        itemHeight={80}
        autoPlay
        autoPlayInterval={4000}
        containerStyle={styles.carouselContainer}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.grey50,
    borderRadius: 12,
    height: 80,
  },
  loadingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  promoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.grey50,
    borderRadius: 12,
  },
  promoIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
  },
});
