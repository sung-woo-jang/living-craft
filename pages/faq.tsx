import { createRoute } from '@granite-js/react-native';
import { StyleSheet,Text, View } from 'react-native';

export const Route = createRoute('/faq', {
  component: Page,
});

function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>자주 묻는 질문</Text>
      <Text style={styles.subtitle}>준비중입니다</Text>
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
