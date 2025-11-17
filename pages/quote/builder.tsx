import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/quote/builder', {
  component: Page,
});

interface ServiceOption {
  id: string;
  name: string;
  description: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'remodeling', name: '전체 리모델링', description: '주거 공간 전체를 새롭게' },
  { id: 'kitchen', name: '주방 리모델링', description: '주방 공간만 개선' },
  { id: 'bathroom', name: '욕실 리모델링', description: '욕실 공간 리뉴얼' },
  { id: 'flooring', name: '바닥 공사', description: '마루, 타일 등 바닥재 교체' },
  { id: 'wallpaper', name: '도배 / 장판', description: '벽지 및 장판 교체' },
  { id: 'window', name: '샤시 / 창호', description: '창문 교체 및 단열' },
];

/**
 * 견적 요청 페이지
 *
 * 필요한 API 연결:
 * 1. POST /api/quotes - 견적 요청 생성
 */
function Page() {
  const navigation = useNavigation();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      Alert.alert('알림', '희망 서비스를 최소 1개 이상 선택해주세요.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('알림', '연락처를 입력해주세요.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('알림', '주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    // API 호출 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('완료', '견적 요청이 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다.', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>견적 요청</Text>
          <Text style={styles.subtitle}>무료로 맞춤 견적을 받아보세요</Text>
        </View>

        {/* 서비스 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            희망 서비스 <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionDescription}>복수 선택 가능</Text>
          <View style={styles.serviceGrid}>
            {SERVICE_OPTIONS.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  selectedServices.includes(service.id) && styles.serviceOptionSelected,
                ]}
                onPress={() => toggleService(service.id)}
              >
                <View style={styles.serviceOptionHeader}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedServices.includes(service.id) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedServices.includes(service.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 고객 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>고객 정보</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              placeholderTextColor={colors.grey400}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              연락처 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="010-1234-5678"
              placeholderTextColor={colors.grey400}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 현장 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>현장 정보</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              주소 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="서울시 강남구 테헤란로 123"
              placeholderTextColor={colors.grey400}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>평수</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 30평"
              placeholderTextColor={colors.grey400}
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>상세 설명</Text>
            <TextInput
              style={styles.textArea}
              placeholder="원하시는 작업 내용이나 특이사항을 자세히 입력해주세요"
              placeholderTextColor={colors.grey400}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length} / 500자</Text>
          </View>
        </View>

        {/* 안내 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 견적 안내</Text>
          <Text style={styles.infoText}>• 견적 요청 후 1영업일 이내 연락드립니다.</Text>
          <Text style={styles.infoText}>• 정확한 견적을 위해 현장 방문이 필요할 수 있습니다.</Text>
          <Text style={styles.infoText}>• 현장 방문 상담은 무료로 진행됩니다.</Text>
        </View>
      </ScrollView>

      {/* 제출 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (selectedServices.length === 0 || !name.trim() || !phone.trim() || !address.trim()) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={
            isSubmitting || selectedServices.length === 0 || !name.trim() || !phone.trim() || !address.trim()
          }
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? '요청 중...' : '견적 요청하기'}</Text>
        </TouchableOpacity>
      </View>
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
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: colors.grey600,
    marginBottom: 16,
  },
  required: {
    color: colors.red500,
  },
  serviceGrid: {
    gap: 12,
  },
  serviceOption: {
    backgroundColor: colors.grey50,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.grey200,
  },
  serviceOptionSelected: {
    backgroundColor: colors.blue50,
    borderColor: colors.blue500,
  },
  serviceOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.grey400,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.blue500,
    borderColor: colors.blue500,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey900,
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.grey600,
    marginLeft: 30,
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
    backgroundColor: colors.grey50,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.grey900,
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  textArea: {
    backgroundColor: colors.grey50,
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: colors.grey900,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  charCount: {
    fontSize: 12,
    color: colors.grey500,
    textAlign: 'right',
    marginTop: 8,
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
  footer: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  submitButton: {
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.grey300,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
