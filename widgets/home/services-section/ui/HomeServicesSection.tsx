import { createRoute } from '@granite-js/react-native';
import { HOME_SERVICES, HomeService } from '@shared/constants/home-services';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 네비게이션 훅 사용을 위한 임시 라우트
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 서비스 섹션
 * 짐싸 스타일의 서비스 리스트
 */
export const HomeServicesSection = () => {
  const navigation = TempRoute.useNavigation();

  const handleQuotePress = (service: HomeService) => {
    navigation.navigate(service.routePath as any);
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>한 번에 인테리어 준비 끝내기</Text>
      </View>

      <View style={styles.serviceList}>
        {HOME_SERVICES.map((service, index) => (
          <View
            key={service.id}
            style={[
              styles.serviceRow,
              index < HOME_SERVICES.length - 1 && styles.serviceRowBorder,
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.iconBgColor }]}>
              <Text style={styles.icon}>{service.icon}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.quoteButton}
              onPress={() => handleQuotePress(service)}
            >
              <Text style={styles.quoteButtonText}>{service.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  serviceList: {
    paddingHorizontal: 4,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  serviceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 22,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.grey600,
  },
  quoteButton: {
    backgroundColor: colors.grey100,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  quoteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
  },
});
