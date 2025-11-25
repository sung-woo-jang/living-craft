import { createRoute } from '@granite-js/react-native';
import { ReservationDetail, SEARCH_MOCK_RESERVATIONS, STATUS_COLORS, STATUS_LABELS } from '@shared/constants';
import { colors } from '@toss/tds-colors';
import { TextField } from '@toss/tds-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/reservation/search', {
  component: Page,
});

/**
 * 예약 조회 페이지
 *
 * 필요한 API 연결:
 * 1. POST /api/reservations/search - 예약 번호와 전화번호로 예약 조회
 */
function Page() {
  const [reservationNumber, setReservationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState<ReservationDetail | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!reservationNumber.trim()) {
      Alert.alert('알림', '예약 번호를 입력해주세요.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요.');
      return;
    }

    setIsSearching(true);

    // API 호출 시뮬레이션
    setTimeout(() => {
      const result = SEARCH_MOCK_RESERVATIONS[reservationNumber];

      if (result && result.customerPhone === phoneNumber) {
        setSearchResult(result);
      } else {
        Alert.alert('알림', '예약 정보를 찾을 수 없습니다.\n예약 번호와 전화번호를 확인해주세요.');
        setSearchResult(null);
      }

      setIsSearching(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (!searchResult) return;

    Alert.alert('예약 취소', '정말 예약을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      {
        text: '예',
        style: 'destructive',
        onPress: () => {
          Alert.alert('완료', '예약이 취소되었습니다.');
          setSearchResult(null);
          setReservationNumber('');
          setPhoneNumber('');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>예약 조회</Text>
          <Text style={styles.subtitle}>예약 번호와 전화번호로 예약 정보를 조회하세요</Text>
        </View>

        {/* 검색 폼 */}
        <View style={styles.searchForm}>
          <View style={styles.inputGroup}>
            <TextField
              variant="box"
              label="예약 번호"
              placeholder="예: R20241210001"
              value={reservationNumber}
              onChangeText={setReservationNumber}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <TextField
              variant="box"
              label="전화번호"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching}
          >
            <Text style={styles.searchButtonText}>{isSearching ? '조회 중...' : '조회하기'}</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        {searchResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>예약 정보</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[searchResult.status] }]}>
                <Text style={styles.statusBadgeText}>{STATUS_LABELS[searchResult.status]}</Text>
              </View>
            </View>

            <View style={styles.resultContent}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>예약 번호</Text>
                <Text style={styles.resultValue}>{searchResult.reservationNumber}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>서비스</Text>
                <Text style={styles.resultValue}>{searchResult.serviceName}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>예약 날짜</Text>
                <Text style={styles.resultValue}>{searchResult.date}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>예약 시간</Text>
                <Text style={styles.resultValue}>{searchResult.time}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>예약자</Text>
                <Text style={styles.resultValue}>{searchResult.customerName}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>연락처</Text>
                <Text style={styles.resultValue}>{searchResult.customerPhone}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>주소</Text>
                <Text style={[styles.resultValue, styles.addressValue]}>{searchResult.address}</Text>
              </View>
            </View>

            {searchResult.status === 'confirmed' && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>예약 취소</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* 안내 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 안내 사항</Text>
          <Text style={styles.infoText}>• 예약 번호는 예약 완료 시 문자로 발송됩니다.</Text>
          <Text style={styles.infoText}>• 예약일 기준 24시간 전까지는 무료 취소가 가능합니다.</Text>
          <Text style={styles.infoText}>• 예약 변경은 고객센터(02-1234-5678)로 문의해주세요.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
  searchForm: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.grey900,
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  searchButton: {
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonDisabled: {
    backgroundColor: colors.grey300,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  resultContent: {
    gap: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 14,
    color: colors.grey600,
    width: 80,
  },
  resultValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.grey900,
    textAlign: 'right',
  },
  addressValue: {
    fontWeight: '400',
  },
  actions: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.red500,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.red500,
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.blue50,
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
    marginBottom: 4,
  },
});
