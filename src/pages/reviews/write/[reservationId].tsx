import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Route = createRoute('/reviews/write/:reservationId', {
  validateParams: (params) => params as { reservationId: string },
  component: Page,
});

function Page() {
  const params = Route.useParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>리뷰 작성</Text>
      <Text style={styles.paramText}>받은 파라미터:</Text>
      <Text style={styles.valueText}>reservationId: {params?.reservationId || 'N/A'}</Text>
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
  paramText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0064FF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    fontFamily: 'monospace',
  },
});
