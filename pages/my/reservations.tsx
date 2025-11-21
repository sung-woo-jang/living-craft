import { createRoute, useNavigation } from '@granite-js/react-native';
import { EmptyState } from '@shared/ui/empty-state';
import { FilterOption, FilterTabs } from '@shared/ui/filter-tabs';
import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my/reservations', {
  component: Page,
});

interface Reservation {
  id: string;
  reservationNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  canCancel: boolean;
  canReview: boolean;
}

const STATUS_LABELS: Record<Reservation['status'], string> = {
  pending: '대기중',
  confirmed: '확정',
  completed: '완료',
  cancelled: '취소',
};

const STATUS_COLORS: Record<Reservation['status'], string> = {
  pending: colors.orange500,
  confirmed: colors.blue500,
  completed: colors.green500,
  cancelled: colors.grey500,
};

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: 'confirmed', label: '확정' },
  { key: 'completed', label: '완료' },
  { key: 'cancelled', label: '취소' },
];

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    reservationNumber: 'R20241210001',
    serviceName: '아파트 전체 리모델링',
    date: '2024-12-20',
    time: '10:00',
    status: 'confirmed',
    canCancel: true,
    canReview: false,
  },
  {
    id: '2',
    reservationNumber: 'R20241205002',
    serviceName: '주방 리모델링',
    date: '2024-12-01',
    time: '14:00',
    status: 'completed',
    canCancel: false,
    canReview: true,
  },
];

/**
 * 내 예약 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/users/me/reservations - 내 예약 목록 조회
 */
function Page() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReservations = MOCK_RESERVATIONS.filter(
    (reservation) => activeFilter === 'all' || reservation.status === activeFilter
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>내 예약</Text>
        <Text style={styles.subtitle}>예약 내역을 확인하세요</Text>
      </View>

      {/* 필터 */}
      <FilterTabs options={FILTER_OPTIONS} activeKey={activeFilter} onFilterChange={setActiveFilter} />

      {/* 예약 목록 */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          icon="📅"
          title="예약 내역이 없습니다"
          description="아직 예약하신 서비스가 없습니다"
          actionLabel="포트폴리오 둘러보기"
          onActionPress={() => navigation.navigate('/portfolio')}
        />
      ) : (
        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
                </View>
                <Text style={styles.reservationNumber}>{item.reservationNumber}</Text>
              </View>

              <Text style={styles.serviceName}>{item.serviceName}</Text>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📅 예약일</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🕐 시간</Text>
                  <Text style={styles.detailValue}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>상세보기</Text>
                </TouchableOpacity>
                {item.canCancel && (
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                )}
                {item.canReview && (
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => navigation.navigate('/reviews/write/:reservationId', { reservationId: item.id })}
                  >
                    <Text style={styles.reviewButtonText}>리뷰 작성</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey600,
  },
  list: {
    padding: 16,
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  reservationNumber: {
    fontSize: 13,
    color: colors.grey600,
    fontFamily: 'monospace',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 12,
  },
  cardDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.grey600,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey900,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey100,
  },
  detailButton: {
    flex: 1,
    backgroundColor: colors.grey100,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: colors.grey700,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.red500,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.red500,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
