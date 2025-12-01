import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ReservationFormData } from '../types';

export function ConfirmationStep() {
  const { watch, setValue } = useFormContext<ReservationFormData>();

  const selectedService = watch('service');
  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');
  const customerInfo = watch('customerInfo');
  const agreedToTerms = watch('agreedToTerms');

  // 시간 선택이 필요한 서비스인지 확인 (기본값: true)
  const requiresTimeSelection = selectedService?.requiresTimeSelection !== false;

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>예약 확인</Text>
          <Text style={styles.sectionSubtitle}>예약 정보를 확인해주세요</Text>
        </View>

        <View style={styles.summaryList}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>서비스</Text>
            <Text style={styles.summaryValue}>{selectedService?.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>날짜</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>시간</Text>
            <Text style={styles.summaryValue}>
              {requiresTimeSelection ? selectedTimeSlot?.time : '하루 종일'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>고객명</Text>
            <Text style={styles.summaryValue}>{customerInfo.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>연락처</Text>
            <Text style={styles.summaryValue}>{customerInfo.phone}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>주소</Text>
            <Text style={styles.summaryValue}>
              {customerInfo.address} {customerInfo.detailAddress}
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <TouchableOpacity style={styles.termsCheckbox} onPress={() => setValue('agreedToTerms', !agreedToTerms)}>
          <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
            {agreedToTerms && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>이용약관 및 개인정보처리방침에 동의합니다</Text>
        </TouchableOpacity>
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
  summaryList: {
    paddingHorizontal: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.grey600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
    flex: 1,
    textAlign: 'right',
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.grey300,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.blue500,
    borderColor: colors.blue500,
  },
  checkboxMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.grey700,
  },
});
