import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { TextField } from '@toss/tds-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CustomerInfo } from '../hooks/useReservationForm';

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

export function CustomerInfoStep({ customerInfo, onCustomerInfoChange }: CustomerInfoStepProps) {
  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>고객 정보</Text>
          <Text style={styles.sectionSubtitle}>예약자 정보를 입력해주세요</Text>
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="이름 *"
            placeholder="이름을 입력해주세요"
            value={customerInfo.name}
            onChangeText={(text) => onCustomerInfoChange({ ...customerInfo, name: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="연락처 *"
            placeholder="010-1234-5678"
            keyboardType="phone-pad"
            value={customerInfo.phone}
            onChangeText={(text) => onCustomerInfoChange({ ...customerInfo, phone: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="주소 *"
            placeholder="기본 주소를 입력해주세요"
            value={customerInfo.address}
            onChangeText={(text) => onCustomerInfoChange({ ...customerInfo, address: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="상세 주소"
            placeholder="상세 주소를 입력해주세요"
            value={customerInfo.detailAddress}
            onChangeText={(text) => onCustomerInfoChange({ ...customerInfo, detailAddress: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="추가 요청사항"
            placeholder="추가로 요청하실 사항이 있으시면 입력해주세요"
            multiline
            numberOfLines={4}
            value={customerInfo.requirements}
            onChangeText={(text) => onCustomerInfoChange({ ...customerInfo, requirements: text })}
          />
        </View>
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
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
