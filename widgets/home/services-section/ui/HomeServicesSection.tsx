import { FEATURED_SERVICES } from '@shared/constants';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 서비스 섹션
 * 주요 서비스 목록을 카드 형태로 표시
 *
 * TODO: GET /api/services - 주요 서비스 목록 조회
 */
export const HomeServicesSection = () => {
  const handleServicePress = (serviceId: string) => {
    // TODO: 서비스 상세 페이지로 이동
    console.log('서비스 클릭:', serviceId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>우리의 서비스</Text>
        <Text style={styles.subtitle}>다양한 인테리어 솔루션을 제공합니다</Text>
      </View>

      <View style={styles.grid}>
        {FEATURED_SERVICES.map((service, index) => (
          <TouchableOpacity
            key={service.id}
            style={[styles.card, (index + 1) % 2 === 0 && { marginRight: 0 }]}
            onPress={() => handleServicePress(service.id)}
          >
            <Text style={styles.icon}>{service.icon}</Text>
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.cardDescription}>{service.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey600,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    width: '48%',
    minWidth: 150,
    marginRight: '4%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.grey200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.grey600,
    textAlign: 'center',
    lineHeight: 20,
  },
});
