import { TimeSlot } from '@shared/constants';
import { HomeService } from '@shared/constants/home-services';
import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CustomerInfo } from '../hooks/useReservationForm';

interface ConfirmationStepProps {
  selectedService: HomeService | null;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  customerInfo: CustomerInfo;
  agreedToTerms: boolean;
  onAgreeChange: (agreed: boolean) => void;
}

export function ConfirmationStep({
  selectedService,
  selectedDate,
  selectedTimeSlot,
  customerInfo,
  agreedToTerms,
  onAgreeChange,
}: ConfirmationStepProps) {
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
            <Text style={styles.summaryValue}>{selectedTimeSlot?.time}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>고객명</Text>
            <Text style={styles.summaryValue}>{customerInfo.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>연락처</Text>
            <Text style={styles.summaryValue}>{customerInfo.phone}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>주소</Text>
            <Text style={styles.summaryValue}>
              {customerInfo.address} {customerInfo.detailAddress}
            </Text>
          </View>
          {selectedService?.price && (
            <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
              <Text style={styles.summaryLabel}>예상 비용</Text>
              <Text style={styles.summaryValuePrice}>₩{selectedService.price.toLocaleString()}</Text>
            </View>
          )}
        </View>
      </Card>

      <Card>
        <TouchableOpacity style={styles.termsCheckbox} onPress={() => onAgreeChange(!agreedToTerms)}>
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
  summaryRowHighlight: {
    backgroundColor: colors.blue50,
    marginHorizontal: -8,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    marginTop: 8,
    borderRadius: 8,
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
  summaryValuePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue600,
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
