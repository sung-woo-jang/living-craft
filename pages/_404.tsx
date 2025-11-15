import { createRoute } from '@granite-js/react-native';
import { StyleSheet,Text, View } from 'react-native';

export const Route = createRoute('/_404', {
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>페이지를 찾을 수 없습니다</Text>
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
    fontSize: 48,
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
