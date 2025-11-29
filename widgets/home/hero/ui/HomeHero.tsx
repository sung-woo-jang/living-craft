import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 히어로 섹션 - Toss 스타일 미니멀 디자인
 * 메인 타이틀과 CTA 버튼을 포함하는 랜딩 섹션
 */
export const HomeHero = () => {
  const handleGetStarted = () => {
    // TODO: 예약하기 페이지로 이동
    console.log('무료 상담 시작하기 클릭');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>인테리어 필름{'\n'}전문 시공</Text>
        <Text style={styles.subtitle}>
          낡은 공간을 새 집처럼 변화시키는{'\n'}
          가장 경제적이고 빠른 방법
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>무료 상담 시작하기</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    // paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  content: {
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 17,
    color: colors.grey700,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    backgroundColor: colors.blue500,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
});
