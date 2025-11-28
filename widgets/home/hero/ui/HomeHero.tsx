import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 히어로 섹션
 * 메인 타이틀과 CTA 버튼을 포함하는 랜딩 섹션
 */
export const HomeHero = () => {
  const handleGetStarted = () => {
    // TODO: 예약하기 페이지로 이동
    console.log('예약하기 클릭');
  };

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>리빙크래프트</Text>
          <Text style={styles.subtitle}>당신의 공간을 특별하게</Text>
          <Text style={styles.description}>
            전문적인 인테리어 서비스로{'\n'}
            완벽한 공간을 만들어드립니다
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>무료 상담 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  content: {
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: colors.grey700,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.grey600,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.blue500,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
