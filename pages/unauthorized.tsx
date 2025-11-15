import { createRoute } from '@granite-js/react-native';
import { StyleSheet,Text, View } from 'react-native';

export const Route = createRoute('/unauthorized', {
  component: Page,
});

function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>권한 없음</Text>
      <Text style={styles.subtitle}>이 페이지에 접근할 권한이 없습니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
  },
});
