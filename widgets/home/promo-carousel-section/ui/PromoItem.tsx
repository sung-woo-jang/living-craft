import type { Promotion } from '@shared/api/types';
import { colors } from '@toss/tds-colors';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PromoItemProps {
  /** 프로모션 데이터 */
  promotion: Promotion;
  /** 클릭 핸들러 */
  onPress: (promotion: Promotion) => void;
}

/**
 * 프로모션 아이템 컴포넌트
 * 아이콘, 제목, 부제목을 표시하는 터치 가능한 배너
 */
export const PromoItem = ({ promotion, onPress }: PromoItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(promotion)}
      activeOpacity={promotion.linkUrl ? 0.7 : 1}
    >
      {promotion.iconUrl && (
        <Image source={{ uri: promotion.iconUrl }} style={styles.icon} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{promotion.title}</Text>
        {promotion.subtitle && (
          <Text style={styles.subtitle}>{promotion.subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.grey50,
    borderRadius: 12,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
  },
});
