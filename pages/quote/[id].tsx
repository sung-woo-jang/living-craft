import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/quote/:id', {
  validateParams: (params) => params as { id: string },
  component: Page,
});

interface QuoteDetail {
  id: string;
  quoteNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  services: string[];
  customerName: string;
  customerPhone: string;
  address: string;
  area?: string;
  description: string;
  estimatedAmount?: number;
  estimatedDuration?: string;
  validUntil?: string;
  createdAt: string;
  notes?: string;
}

const STATUS_LABELS: Record<QuoteDetail['status'], string> = {
  pending: '검토중',
  completed: '견적 완료',
  rejected: '거절됨',
};

const STATUS_COLORS: Record<QuoteDetail['status'], string> = {
  pending: colors.orange500,
  completed: colors.green500,
  rejected: colors.grey500,
};

// Mock 데이터
const MOCK_QUOTES: Record<string, QuoteDetail> = {
  '1': {
    id: '1',
    quoteNumber: 'Q20241210001',
    status: 'completed',
    services: ['전체 리모델링', '주방 리모델링'],
    customerName: '김철수',
    customerPhone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    area: '30평',
    description: '아파트 전체 리모델링 및 주방 맞춤 제작 희망',
    estimatedAmount: 35000000,
    estimatedDuration: '4-5주',
    validUntil: '2024-12-31',
    createdAt: '2024-12-10',
    notes: '현장 방문 상담 후 최종 견적이 조정될 수 있습니다.',
  },
  '2': {
    id: '2',
    quoteNumber: 'Q20241205002',
    status: 'pending',
    services: ['욕실 리모델링'],
    customerName: '이영희',
    customerPhone: '010-2345-6789',
    address: '서울시 서초구 반포대로 456',
    area: '20평',
    description: '욕실 2개 리모델링 희망',
    createdAt: '2024-12-05',
  },
};

/**
 * 견적 상세 보기 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/quotes/{id} - 견적 상세 정보 조회
 */
function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();

  const quote = MOCK_QUOTES[params?.id || '1'];

  if (!quote) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>견적 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>견적서</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[quote.status] }]}>
              <Text style={styles.statusBadgeText}>{STATUS_LABELS[quote.status]}</Text>
            </View>
          </View>
          <Text style={styles.quoteNumber}>견적 번호: {quote.quoteNumber}</Text>
          <Text style={styles.date}>요청일: {quote.createdAt}</Text>
        </View>

        {/* 요청 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청 정보</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>고객명</Text>
              <Text style={styles.infoValue}>{quote.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{quote.customerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={[styles.infoValue, styles.addressValue]}>{quote.address}</Text>
            </View>
            {quote.area && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>평수</Text>
                <Text style={styles.infoValue}>{quote.area}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 요청 서비스 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청 서비스</Text>
          <View style={styles.serviceList}>
            {quote.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceBullet}>•</Text>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 상세 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 설명</Text>
          <Text style={styles.description}>{quote.description}</Text>
        </View>

        {/* 견적 금액 (완료된 경우만) */}
        {quote.status === 'completed' && quote.estimatedAmount && (
          <View style={styles.estimateSection}>
            <Text style={styles.estimateTitle}>견적 금액</Text>
            <Text style={styles.estimateAmount}>
              {quote.estimatedAmount.toLocaleString()}원
            </Text>

            {quote.estimatedDuration && (
              <View style={styles.estimateDetail}>
                <Text style={styles.estimateDetailLabel}>예상 공사 기간</Text>
                <Text style={styles.estimateDetailValue}>{quote.estimatedDuration}</Text>
              </View>
            )}

            {quote.validUntil && (
              <View style={styles.estimateDetail}>
                <Text style={styles.estimateDetailLabel}>견적 유효 기간</Text>
                <Text style={styles.estimateDetailValue}>{quote.validUntil}까지</Text>
              </View>
            )}

            {quote.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{quote.notes}</Text>
              </View>
            )}
          </View>
        )}

        {/* 대기 중 안내 */}
        {quote.status === 'pending' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>⏳ 견적 검토 중</Text>
            <Text style={styles.infoText}>
              견적 요청이 접수되었습니다. 빠른 시일 내에 견적서를 발송해드리겠습니다.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      {quote.status === 'completed' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.contactButton} onPress={() => {}}>
            <Text style={styles.contactButtonText}>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reserveButton} onPress={() => navigation.navigate('/reservation')}>
            <Text style={styles.reserveButtonText}>예약하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quoteNumber: {
    fontSize: 14,
    color: colors.grey700,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.grey600,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.grey600,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.grey900,
    textAlign: 'right',
  },
  addressValue: {
    fontWeight: '400',
  },
  serviceList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceBullet: {
    fontSize: 16,
    color: colors.blue500,
    marginRight: 8,
    fontWeight: 'bold',
  },
  serviceText: {
    flex: 1,
    fontSize: 15,
    color: colors.grey800,
  },
  description: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 22,
  },
  estimateSection: {
    backgroundColor: colors.blue50,
    padding: 20,
    marginTop: 12,
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey700,
    marginBottom: 8,
  },
  estimateAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.blue600,
    marginBottom: 20,
  },
  estimateDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  estimateDetailLabel: {
    fontSize: 14,
    color: colors.grey700,
  },
  estimateDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
  },
  notesBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  notesText: {
    fontSize: 13,
    color: colors.grey700,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: colors.orange50,
    borderRadius: 12,
    padding: 16,
    margin: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.grey700,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.blue500,
    fontSize: 16,
    fontWeight: '600',
  },
  reserveButton: {
    flex: 1,
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.grey50,
  },
  errorText: {
    fontSize: 16,
    color: colors.grey700,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.blue500,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
