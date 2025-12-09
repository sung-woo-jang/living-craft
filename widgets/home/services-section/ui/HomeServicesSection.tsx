import { createRoute } from '@granite-js/react-native';
import { Service } from '@shared/api/types';
import { useServices } from '@shared/hooks/useServices';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Asset, Skeleton } from '@toss/tds-react-native';
import { useReservationStore } from '@widgets/reservation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 네비게이션 훅 사용을 위한 임시 라우트
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 서비스 섹션
 * 짐싸 스타일의 서비스 리스트
 */
export const HomeServicesSection = () => {
  const navigation = TempRoute.useNavigation();
  const updateFormData = useReservationStore(['updateFormData']).updateFormData;

  const { data: services, isLoading } = useServices();

  const handleQuotePress = (service: Service) => {
    // 클릭한 서비스를 미리 선택
    updateFormData({ service });

    // 예약 페이지로 이동
    navigation.navigate('/reservation/service' as any);
  };

  if (isLoading) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.title}>한 번에 인테리어 준비 끝내기</Text>
        </View>
        <View style={styles.serviceList}>
          {Array.from({ length: 2 }).map((_, index) => (
            <View key={index} style={[styles.serviceRow, index < 1 && styles.serviceRowBorder]}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={styles.serviceInfo}>
                <Skeleton width="60%" height={17} borderRadius={4} />
                <View style={{ height: 4 }} />
                <Skeleton width="80%" height={14} borderRadius={4} />
              </View>
              <Skeleton width={76} height={38} borderRadius={8} />
            </View>
          ))}
        </View>
      </Card>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.title}>한 번에 인테리어 준비 끝내기</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>등록된 서비스가 없습니다.</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>한 번에 인테리어 준비 끝내기</Text>
      </View>

      <View style={styles.serviceList}>
        {services.map((service, index) => (
          <View key={service.id} style={[styles.serviceRow, index < services.length - 1 && styles.serviceRowBorder]}>
            <View style={[styles.iconContainer, { backgroundColor: service.iconBgColor || colors.grey100 }]}>
              {service.icon?.name ? (
                <Asset.Icon name={service.icon.name} color={colors.grey700} frameShape={Asset.frameShape.CleanW24} />
              ) : (
                <Text style={styles.icon}>🏠</Text>
              )}
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>

            <TouchableOpacity style={styles.quoteButton} onPress={() => handleQuotePress(service)}>
              <Text style={styles.quoteButtonText}>견적 받기</Text>
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
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.grey600,
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
