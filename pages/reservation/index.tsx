import { createRoute } from '@granite-js/react-native';
import { ALL_TIME_SLOTS, TimeSlot } from '@shared/constants';
import { HOME_SERVICES, HomeService } from '@shared/constants/home-services';
import { Card } from '@shared/ui';
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
 */
function generateRandomDisabledDates(): Date[] {
  const disabledDates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledCount = Math.floor(Math.random() * 5) + 8;
  const disabledDayIndices = new Set<number>();

  while (disabledDayIndices.size < disabledCount) {
    const randomDay = Math.floor(Math.random() * 30) + 1;
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
 */
function generateRandomTimeSlots(dateString: string): TimeSlot[] {
  let seedValue = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  return ALL_TIME_SLOTS.map((slot) => ({
    ...slot,
    available: seededRandom() > 0.3,
  }));
}

/**
 * 예약 페이지 - 짐싸 스타일 멀티 스텝 폼
 */
function Page() {
  const navigation = Route.useNavigation();
  const [currentStep, setCurrentStep] = useState<StepKey>('service');
  const [selectedService, setSelectedService] = useState<HomeService | null>(null);
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

  const disabledDates = useMemo(() => generateRandomDisabledDates(), []);

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
      const reservationData = {
        serviceId: selectedService?.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot?.time,
        customerInfo,
      };

      console.log('예약 데이터:', reservationData);

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
            <Card>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>서비스 선택</Text>
                <Text style={styles.sectionSubtitle}>원하시는 서비스를 선택해주세요</Text>
              </View>

              {HOME_SERVICES.map((service, index) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceRow,
                    selectedService?.id === service.id && styles.serviceRowSelected,
                    index < HOME_SERVICES.length - 1 && styles.serviceRowBorder,
                  ]}
                  onPress={() => setSelectedService(service)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: service.iconBgColor }]}>
                    <Text style={styles.icon}>{service.icon}</Text>
                  </View>

                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    {service.price && (
                      <Text style={styles.servicePrice}>₩{service.price.toLocaleString()}</Text>
                    )}
                  </View>

                  <View style={[styles.checkIcon, selectedService?.id === service.id && styles.checkIconSelected]}>
                    {selectedService?.id === service.id && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </ScrollView>
        );

      case 'datetime':
        return (
          <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
            <Card>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>날짜 선택</Text>
              </View>
              <TouchableOpacity style={styles.dateInputButton} onPress={() => setIsCalendarVisible(true)}>
                <Text style={selectedDate ? styles.dateInputTextSelected : styles.dateInputText}>
                  {selectedDate || '날짜를 선택해주세요'}
                </Text>
              </TouchableOpacity>
            </Card>

            {selectedDate && (
              <Card>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>시간 선택</Text>
                </View>
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
              </Card>
            )}
          </ScrollView>
        );

      case 'customer':
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
            </Card>
          </ScrollView>
        );

      case 'confirmation':
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
              <TouchableOpacity style={styles.termsCheckbox} onPress={() => setAgreedToTerms(!agreedToTerms)}>
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>이용약관 및 개인정보처리방침에 동의합니다</Text>
              </TouchableOpacity>
            </Card>
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
      <ProgressStepper activeStepIndex={STEP_ORDER.indexOf(currentStep)} checkForFinish>
        <ProgressStep title="서비스" />
        <ProgressStep title="날짜/시간" />
        <ProgressStep title="정보입력" />
        <ProgressStep title="확인" />
      </ProgressStepper>

      <View style={styles.contentContainer}>{renderStepContent()}</View>

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

      <CalendarBottomSheet
        visible={isCalendarVisible}
        selectedDate={parseStringToDate(selectedDate)}
        disabledDates={disabledDates}
        title="예약 날짜 선택"
        confirmButtonText="날짜 선택"
        onConfirm={(date) => {
          setSelectedDate(formatDateToString(date));
          setSelectedTimeSlot(null);
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
    backgroundColor: colors.greyBackground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greyBackground,
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
  },
  scrollContent: {
    paddingVertical: 10,
  },

  // Section Header
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

  // Service Selection
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  serviceRowSelected: {
    backgroundColor: colors.blue50,
  },
  serviceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 22,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.grey600,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.blue600,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconSelected: {
    backgroundColor: colors.blue500,
    borderColor: colors.blue500,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Date Selection
  dateInputButton: {
    backgroundColor: colors.grey50,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  dateInputText: {
    fontSize: 15,
    color: colors.grey400,
  },
  dateInputTextSelected: {
    fontSize: 15,
    color: colors.grey900,
  },

  // Time Slots
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  timeSlot: {
    minWidth: 72,
    backgroundColor: colors.grey50,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.blue500,
  },
  timeSlotDisabled: {
    backgroundColor: colors.grey100,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.grey900,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: colors.white,
  },
  timeSlotTextDisabled: {
    color: colors.grey400,
  },

  // Form
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  // Summary
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

  // Terms
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

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.grey700,
  },
});
