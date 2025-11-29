import { PROMO_BANNERS, PromoBanner } from '@shared/constants/promo-banners';
import { Card } from '@shared/ui/card';
import { Carousel } from '@shared/ui/carousel';
import { colors } from '@toss/tds-colors';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = 10;
const CARD_HORIZONTAL_PADDING = 8;
const CAROUSEL_WIDTH = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2) - (CARD_HORIZONTAL_PADDING * 2);

export const HomePromoCarouselSection = () => {
  const renderPromoItem = (item: PromoBanner) => {
    return (
      <View style={styles.promoItem}>
        {item.iconUrl && (
          <Image source={{ uri: item.iconUrl }} style={styles.promoIcon} />
        )}
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>{item.title}</Text>
          <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <Card>
      <Carousel
        data={PROMO_BANNERS}
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
