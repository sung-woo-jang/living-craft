import { colors } from '@toss/tds-colors';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * 섹션용 Card 컴포넌트
 *
 * 페이지 내 섹션을 나누는 컨테이너 역할을 하는 카드 컴포넌트입니다.
 * 디자인 가이드의 기본값을 고정하여 일관된 UI를 제공합니다.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text style={styles.title}>제목</Text>
 *   <Text style={styles.content}>내용</Text>
 * </Card>
 * ```
 *
 * @example 추가 스타일이 필요한 경우
 * ```tsx
 * <Card style={{ marginHorizontal: 20 }}>
 *   <Text>커스텀 마진이 적용된 카드</Text>
 * </Card>
 * ```
 */
export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    // 배경색: CardBg-White (#FFFFFF) 고정
    backgroundColor: colors.white,

    // Border Radius: 8px (피그마 가이드)
    borderRadius: 8,

    // 패딩: 상하 8px, 좌우 16px (피그마 가이드)
    paddingVertical: 8,
    paddingHorizontal: 16,

    // 마진: 하단 마진으로 카드 간 간격 확보
    marginBottom: 16,

    // 보더: 디자인 가이드 패턴
    borderWidth: 1,
    borderColor: colors.grey200,

    // 그림자: Common_Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    // 그림자: Common_Shadow (Android)
    elevation: 4,
  },
});
