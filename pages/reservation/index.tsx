import { createRoute } from '@granite-js/react-native';
import { ALL_TIME_SLOTS, RESERVATION_SERVICES, TimeSlot } from '@shared/constants';
import { CalendarBottomSheet } from '@shared/ui/calendar-bottom-sheet';
import { formatDateToString, parseStringToDate } from '@shared/ui/calendar-bottom-sheet/utils';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { TextField } from '@toss/tds-react-native';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/reservation', {
  component: Page,
});

type StepKey = 'service' | 'datetime' | 'customer' | 'confirmation';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  requirements: string;
}

const STEP_ORDER: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];

/**
 * 랜덤하게 예약 불가능한 날짜를 생성합니다.
 * 향후 30일 중 랜덤하게 8~12개의 날짜를 선택합니다.
 */
function generateRandomDisabledDates(): Date[] {
  const disabledDates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 랜덤하게 8~12개의 날짜를 비활성화
  const disabledCount = Math.floor(Math.random() * 5) + 8; // 8~12
  const disabledDayIndices = new Set<number>();

  while (disabledDayIndices.size < disabledCount) {
    const randomDay = Math.floor(Math.random() * 30) + 1; // 1~30일
    disabledDayIndices.add(randomDay);
  }

  disabledDayIndices.forEach((dayOffset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    disabledDates.push(date);
  });

  return disabledDates;
}

/**
 * 날짜별 시간 슬롯 가용성을 랜덤하게 생성합니다.
 * 각 날짜마다 3~7개의 시간대가 랜덤하게 활성화됩니다.
 */
function generateRandomTimeSlots(dateString: string): TimeSlot[] {
  // 날짜 문자열을 시드로 사용하여 일관된 랜덤 결과 생성
  // 시드 기반 랜덤 함수
  let seedValue = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  // 각 시간 슬롯을 개별적으로 랜덤하게 활성화 (30~70% 확률)
  return ALL_TIME_SLOTS.map((slot) => ({
    ...slot,
    available: seededRandom() > 0.3, // 70% 확률로 활성화
  }));
}

/**
 * 예약 페이지 - 멀티 스텝 폼
 *
 * 필요한 API 연결:
 * 1. GET /api/services - 예약 가능한 서비스
 * 2. GET /api/calendar/available - 예약 가능한 날짜
 * 3. GET /api/calendar/slots?date={date} - 시간 슬롯
 * 4. POST /api/reservations - 예약 생성
 */
function Page() {
  const navigation = Route.useNavigation();
  const [currentStep, setCurrentStep] = useState<StepKey>('service');
  const [selectedService, setSelectedService] = useState<(typeof RESERVATION_SERVICES)[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    requirements: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // 랜덤하게 예약 불가능한 날짜 생성 (컴포넌트 마운트 시 한 번만)
  const disabledDates = useMemo(() => generateRandomDisabledDates(), []);

  // 선택된 날짜에 따른 시간 슬롯 생성
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateRandomTimeSlots(selectedDate);
  }, [selectedDate]);

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 'service':
        return selectedService !== null;
      case 'datetime':
        return selectedDate !== '' && selectedTimeSlot !== null;
      case 'customer':
        return (
          customerInfo.name.trim() !== '' && customerInfo.phone.trim() !== '' && customerInfo.address.trim() !== ''
        );
      case 'confirmation':
        return agreedToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }

    const currentIndex = STEP_ORDER.indexOf(currentStep);

    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNext()) {
      Alert.alert('알림', '이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API 연동 - POST /api/reservations
      const reservationData = {
        serviceId: selectedService?.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot?.time,
        customerInfo,
        type: selectedService?.type,
      };

      console.log('예약 데이터:', reservationData);

      // Mock delay
      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });

      Alert.alert('예약 완료', '예약이 성공적으로 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('/' as any),
        },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('오류', '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'service':
        return (
          <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepDescription}>원하시는 서비스를 선택해주세요</Text>
            {RESERVATION_SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, selectedService?.id === service.id && styles.serviceCardSelected]}
                onPress={() => setSelectedService(service)}
              >
                {selectedService?.id === service.id && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>선택됨</Text>
                  </View>
                )}
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                {service.price && <Text style={styles.servicePrice}>₩{service.price.toLocaleString()}</Text>}
                <View style={styles.serviceFeatures}>
                  {service.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'datetime':
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.stepDescription}>예약하실 날짜와 시간을 선택해주세요</Text>

            <View style={styles.dateSection}>
              <Text style={styles.sectionLabel}>날짜 선택</Text>
              <TouchableOpacity style={styles.dateInputButton} onPress={() => setIsCalendarVisible(true)}>
                <Text
                  style={selectedDate ? [styles.dateInputText, styles.dateInputTextSelected] : styles.dateInputText}
                >
                  {selectedDate || '날짜를 선택해주세요'}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedDate && (
              <View style={styles.timeSlotSection}>
                <Text style={styles.sectionLabel}>시간 선택</Text>
                <View style={styles.timeSlotGrid}>
                  {timeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.id}
                      style={[
                        styles.timeSlot,
                        selectedTimeSlot?.id === slot.id && styles.timeSlotSelected,
                        !slot.available && styles.timeSlotDisabled,
                      ]}
                      onPress={() => slot.available && setSelectedTimeSlot(slot)}
                      disabled={!slot.available}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTimeSlot?.id === slot.id && styles.timeSlotTextSelected,
                          !slot.available && styles.timeSlotTextDisabled,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        );

      case 'customer':
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.stepDescription}>고객 정보를 입력해주세요</Text>

            <View style={styles.formGroup}>
              <TextField
                variant="box"
                label="이름 *"
                placeholder="이름을 입력해주세요"
                value={customerInfo.name}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <TextField
                variant="box"
                label="연락처 *"
                placeholder="010-1234-5678"
                keyboardType="phone-pad"
                value={customerInfo.phone}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, phone: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <TextField
                variant="box"
                label="주소 *"
                placeholder="기본 주소를 입력해주세요"
                value={customerInfo.address}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, address: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <TextField
                variant="box"
                label="상세 주소"
                placeholder="상세 주소를 입력해주세요"
                value={customerInfo.detailAddress}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, detailAddress: text })}
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
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, requirements: text })}
              />
            </View>
          </ScrollView>
        );

      case 'confirmation':
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.stepDescription}>예약 정보를 확인해주세요</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>서비스</Text>
                <Text style={styles.summaryValue}>{selectedService?.name}</Text>
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
                  <Text style={[styles.summaryValue, styles.summaryValuePrice]}>
                    ₩{selectedService.price.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.termsCheckbox} onPress={() => setAgreedToTerms(!agreedToTerms)}>
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>이용약관 및 개인정보처리방침에 동의합니다</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>예약을 처리하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 스텝 인디케이터 */}
      <ProgressStepper activeStepIndex={STEP_ORDER.indexOf(currentStep)} checkForFinish>
        <ProgressStep title="서비스 선택" />
        <ProgressStep title="날짜/시간" />
        <ProgressStep title="고객 정보" />
        <ProgressStep title="예약 확인" />
      </ProgressStepper>

      {/* 스텝 콘텐츠 */}
      <View style={styles.contentContainer}>{renderStepContent()}</View>

      {/* 액션 버튼 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary, currentStep === 'service' && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 'service'}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>이전</Text>
        </TouchableOpacity>

        {currentStep === 'confirmation' ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, !canProceedToNext() && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!canProceedToNext()}
          >
            <Text style={styles.buttonText}>예약 완료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, !canProceedToNext() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!canProceedToNext()}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 캘린더 바텀싯 */}
      <CalendarBottomSheet
        visible={isCalendarVisible}
        selectedDate={parseStringToDate(selectedDate)}
        disabledDates={disabledDates}
        title="예약 날짜 선택"
        confirmButtonText="날짜 선택"
        onConfirm={(date) => {
          setSelectedDate(formatDateToString(date));
          setSelectedTimeSlot(null); // 날짜 변경 시 시간 선택 초기화
          setIsCalendarVisible(false);
        }}
        onClose={() => setIsCalendarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.grey700,
  },

  contentContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.grey700,
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.grey200,
    position: 'relative',
  },
  serviceCardSelected: {
    borderColor: colors.blue500,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.blue500,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  serviceIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.grey600,
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue600,
    marginBottom: 12,
  },
  serviceFeatures: {
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
  dateSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 12,
  },
  dateInputButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateInputText: {
    fontSize: 15,
    color: colors.grey400,
  },
  dateInputTextSelected: {
    color: colors.grey900,
  },
  timeSlotSection: {
    marginBottom: 24,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    flex: 0,
    minWidth: 80,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.blue500,
    borderColor: colors.blue500,
  },
  timeSlotDisabled: {
    backgroundColor: colors.grey100,
    borderColor: colors.grey200,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.grey900,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: 'white',
  },
  timeSlotTextDisabled: {
    color: colors.grey400,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.grey900,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  summaryRowHighlight: {
    backgroundColor: colors.blue50,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: -20,
    paddingBottom: 20,
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
  summaryValuePrice: {
    fontSize: 18,
    color: colors.blue600,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.grey700,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24, // 하단 여백 추가 (Safe Area 고려)
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blue500,
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonTextSecondary: {
    color: colors.grey700,
  },
});
