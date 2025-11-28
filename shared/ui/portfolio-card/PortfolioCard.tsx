import { colors } from '@toss/tds-colors';
import { Image } from '@granite-js/react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@shared/ui';

export interface Portfolio {
  id: number;
  projectName: string;
  client: string;
  duration: string;
  category: string;
  thumbnail: string; // 이미지 URL
  description: string;
  images: string[]; // 이미지 URL 배열
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onPress: (portfolioId: number) => void;
}

/**
 * 포트폴리오 카드 컴포넌트
 * 포트폴리오 목록에서 사용하는 카드 UI
 */
export const PortfolioCard = ({ portfolio, onPress }: PortfolioCardProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(portfolio.id)}>
      <Card style={styles.card}>
        {/* 이미지 섹션 */}
        <View style={styles.imageContainer}>
        {portfolio.thumbnail ? (
          <Image
            source={{ uri: portfolio.thumbnail }}
            style={styles.image}
            resizeMode="cover"
            onError={() => {
              console.warn(`Failed to load portfolio thumbnail: ${portfolio.id}`);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📷</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{portfolio.category}</Text>
        </View>
      </View>

      {/* 콘텐츠 섹션 */}
      <View style={styles.content}>
        <Text style={styles.projectName} numberOfLines={1}>
          {portfolio.projectName}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {portfolio.description}
        </Text>

        {/* 클라이언트 & 작업기간 */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>클라이언트</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {portfolio.client}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>작업기간</Text>
            <Text style={styles.detailValue}>{portfolio.duration}</Text>
          </View>
        </View>
      </View>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <Text style={styles.viewDetailText}>자세히 보기</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: colors.grey100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.grey900,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.grey500,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grey900,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.grey200,
    marginHorizontal: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue500,
  },
});
