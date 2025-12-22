import { createRoute, useNavigation } from '@granite-js/react-native';
import { ReservationStatus } from '@shared/api/types';
import { useMyReservations, useRefresh } from '@shared/hooks';
import { EmptyState } from '@shared/ui/empty-state';
import { FilterOption, FilterTabs } from '@shared/ui/filter-tabs';
import { colors } from '@toss/tds-colors';
import { Skeleton } from '@toss/tds-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my/reservations', {
  component: Page,
});

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: ReservationStatus.CONFIRMED, label: '확정' },
  { key: ReservationStatus.COMPLETED, label: '완료' },
  { key: ReservationStatus.CANCELLED, label: '취소' },
];

const STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: '대기',
  [ReservationStatus.CONFIRMED]: '확정',
  [ReservationStatus.COMPLETED]: '완료',
  [ReservationStatus.CANCELLED]: '취소',
};

const STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: colors.yellow500,
  [ReservationStatus.CONFIRMED]: colors.blue500,
  [ReservationStatus.COMPLETED]: colors.green500,
  [ReservationStatus.CANCELLED]: colors.grey400,
};

/**
 * 내 예약 페이지
 */
function Page() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<'all' | ReservationStatus>('all');

  const reservationsQuery = useMyReservations();
  const { data: reservationsResponse, isLoading } = reservationsQuery;
  const { refreshing, onRefresh } = useRefresh(reservationsQuery);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>내 예약</Text>
          <Text style={styles.subtitle}>예약 내역을 확인하세요</Text>
        </View>
        <View style={styles.list}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.reservationCard}>
              <View style={styles.cardHeader}>
                <Skeleton width={50} height={22} borderRadius={12} />
                <Skeleton width={80} height={13} borderRadius={4} />
              </View>
              <Skeleton width="60%" height={18} borderRadius={4} />
              <View style={{ height: 12 }} />
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Skeleton width={80} height={14} borderRadius={4} />
                  <Skeleton width={100} height={14} borderRadius={4} />
                </View>
                <View style={styles.detailRow}>
                  <Skeleton width={60} height={14} borderRadius={4} />
                  <Skeleton width={80} height={14} borderRadius={4} />
                </View>
              </View>
              <View style={[styles.cardActions, { borderTopWidth: 0 }]}>
                <Skeleton width="100%" height={38} borderRadius={8} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const allReservations = reservationsResponse?.data || [];
  const filteredReservations = allReservations.filter(
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
      <FilterTabs
        options={FILTER_OPTIONS}
        activeKey={activeFilter}
        onFilterChange={(key) => setActiveFilter(key as 'all' | ReservationStatus)}
      />

      {/* 예약 목록 */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          iconName="icon-calendar-3-blue"
          title="예약 내역이 없습니다"
          description="아직 예약하신 서비스가 없습니다"
          actionLabel="포트폴리오 둘러보기"
          onActionPress={() => navigation.navigate('/portfolio')}
        />
      ) : (
        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.reservationCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
                </View>
                <Text style={styles.reservationNumber}>#{item.reservationNumber}</Text>
              </View>

              <Text style={styles.serviceName}>{item.service.title}</Text>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📅 견적 날짜</Text>
                  <Text style={styles.detailValue}>{item.estimateDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🕐 시간</Text>
                  <Text style={styles.detailValue}>{item.estimateTime}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>상세보기</Text>
                </TouchableOpacity>
                {item.status === ReservationStatus.CONFIRMED && (
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                )}
                {item.status === ReservationStatus.COMPLETED && !item.hasReview && (
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() =>
                      navigation.navigate('/reviews/write/:reservationId', { reservationId: String(item.id) })
                    }
                  >
                    <Text style={styles.reviewButtonText}>리뷰 작성</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
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
