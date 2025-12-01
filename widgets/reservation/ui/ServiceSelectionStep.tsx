import { HOME_SERVICES, HomeService } from '@shared/constants/home-services';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ServiceSelectionStepProps {
  selectedService: HomeService | null;
  onSelect: (service: HomeService) => void;
}

export function ServiceSelectionStep({ selectedService, onSelect }: ServiceSelectionStepProps) {
  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>서비스 선택</Text>
          <Text style={styles.sectionSubtitle}>원하시는 서비스를 선택해주세요</Text>
        </View>

        {HOME_SERVICES.map((service, index) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceRow,
              selectedService?.id === service.id && styles.serviceRowSelected,
              index < HOME_SERVICES.length - 1 && styles.serviceRowBorder,
            ]}
            onPress={() => onSelect(service)}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.iconBgColor }]}>
              <Text style={styles.icon}>{service.icon}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              {service.price && <Text style={styles.servicePrice}>₩{service.price.toLocaleString()}</Text>}
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
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.blue600,
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
