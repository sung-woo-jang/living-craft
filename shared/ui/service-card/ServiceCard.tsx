import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ServiceType = 'fixed';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  type: ServiceType;
  duration: string;
  features: string[];
  image: string | null;
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  fixed: '정찰제',
} as const;

interface ServiceCardProps {
  service: Service;
  onPress: (serviceId: number) => void;
  onBookPress: (serviceId: number) => void;
}

/**
 * 서비스 카드 컴포넌트
 * 서비스 목록에서 사용하는 카드 UI
 */
export const ServiceCard = ({ service, onPress, onBookPress }: ServiceCardProps) => {
  return (
    <View style={styles.card}>
      {/* 이미지 섹션 */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>📷</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{SERVICE_TYPE_LABELS[service.type]}</Text>
        </View>
      </View>

      {/* 콘텐츠 섹션 */}
      <View style={styles.content}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        {/* 가격 & 소요시간 */}
        <View style={styles.detailsRow}>
          <Text style={styles.price}>
            {service.price}
          </Text>
          <View style={styles.durationContainer}>
            <Text style={styles.durationIcon}>⏱</Text>
            <Text style={styles.duration}>{service.duration}</Text>
          </View>
        </View>

        {/* 포함 서비스 */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>포함 서비스</Text>
          <View style={styles.featuresList}>
            {service.features.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.detailButton} onPress={() => onPress(service.id)}>
          <Text style={styles.detailButtonText}>상세보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={() => onBookPress(service.id)}>
          <Text style={styles.bookButtonText}>예약하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: colors.grey100,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.blue500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue600,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationIcon: {
    fontSize: 14,
  },
  duration: {
    fontSize: 13,
    color: colors.grey600,
  },
  featuresSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.grey700,
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: colors.grey100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 11,
    color: colors.grey700,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 0,
  },
  detailButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: colors.blue500,
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
