import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/_404', {
  component: NotFoundPage,
});

function NotFoundPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>페이지를 찾을 수 없습니다</Text>
      <Text style={styles.description}>요청하신 페이지가 존재하지 않거나 삭제되었습니다.</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('/')}>
          <Text style={styles.primaryButtonText}>홈으로 이동</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>이전 페이지로</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.grey50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.grey900,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.grey800,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.grey600,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 300,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.grey700,
    fontSize: 16,
    fontWeight: '600',
  },
});
