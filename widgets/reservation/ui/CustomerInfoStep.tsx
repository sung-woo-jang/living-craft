import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { TextField } from '@toss/tds-react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ReservationFormData } from '../types';

export function CustomerInfoStep() {
  const { control } = useFormContext<ReservationFormData>();

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>고객 정보</Text>
          <Text style={styles.sectionSubtitle}>예약자 정보를 입력해주세요</Text>
        </View>

        <Controller
          control={control}
          name="customerInfo.name"
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="box"
              label="이름 *"
              placeholder="이름을 입력해주세요"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="customerInfo.phone"
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="box"
              label="연락처 *"
              placeholder="010-1234-5678"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="customerInfo.address"
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="box"
              label="주소 *"
              placeholder="기본 주소를 입력해주세요"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="customerInfo.detailAddress"
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="box"
              label="상세 주소"
              placeholder="상세 주소를 입력해주세요"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="customerInfo.requirements"
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="box"
              label="추가 요청사항"
              placeholder="추가로 요청하실 사항이 있으시면 입력해주세요"
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
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
});
