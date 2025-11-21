import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 CTA (Call to Action) 섹션
 * 사용자에게 행동을 유도하는 섹션
 */
export const HomeCtaSection = () => {
  const handleContact = () => {
    // TODO: 문의하기 섹션으로 스크롤 또는 페이지 이동
    console.log('문의하기 클릭');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>지금 바로 시작하세요</Text>
        <Text style={styles.description}>
          전문 디자이너와 함께{'\n'}
          당신만의 특별한 공간을 만들어보세요
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleContact}>
            <Text style={styles.primaryButtonText}>상담 문의</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue500,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  content: {
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.blue500,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
