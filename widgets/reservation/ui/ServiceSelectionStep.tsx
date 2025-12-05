import { HOME_SERVICES } from '@shared/constants/home-services';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { Asset } from '@toss/tds-react-native';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useReservationStore } from '../store';
import { ReservationFormData } from '../types';

export function ServiceSelectionStep() {
  const { watch, setValue } = useFormContext<ReservationFormData>();
  const selectedService = watch('service');

  const { availableServiceIds } = useReservationStore(['availableServiceIds']);

  // 선택된 지역에서 가능한 서비스만 필터링
  const availableServices = useMemo(() => {
    if (availableServiceIds.length === 0) {
      return HOME_SERVICES; // 지역이 선택되지 않은 경우 전체 서비스 표시
    }
    return HOME_SERVICES.filter((service) => availableServiceIds.includes(service.id));
  }, [availableServiceIds]);

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>서비스 선택</Text>
          <Text style={styles.sectionSubtitle}>원하시는 서비스를 선택해주세요</Text>
        </View>

        {availableServices.map((service, index) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceRow,
              selectedService?.id === service.id && styles.serviceRowSelected,
              index < availableServices.length - 1 && styles.serviceRowBorder,
            ]}
            onPress={() => setValue('service', service)}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.iconBgColor }]}>
              <Asset.Icon name={service.iconName} color={colors.grey700} frameShape={Asset.frameShape.CleanW24} />
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>

            <View style={[styles.checkIcon, selectedService?.id === service.id && styles.checkIconSelected]}>
              {selectedService?.id === service.id && <Text style={styles.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.grey600,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  serviceRowSelected: {
    backgroundColor: colors.blue50,
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
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.grey600,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconSelected: {
    backgroundColor: colors.blue500,
    borderColor: colors.blue500,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
