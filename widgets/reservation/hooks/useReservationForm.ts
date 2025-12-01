import { TimeSlot } from '@shared/constants';
import { HomeService } from '@shared/constants/home-services';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { generateRandomDisabledDates, generateRandomTimeSlots } from '../utils';

export type StepKey = 'service' | 'datetime' | 'customer' | 'confirmation';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  requirements: string;
}

export const STEP_ORDER: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];

interface UseReservationFormOptions {
  onSubmitSuccess?: () => void;
}

export function useReservationForm(options?: UseReservationFormOptions) {
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
          onPress: () => options?.onSubmitSuccess?.(),
        },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('오류', '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  return {
    // State
    currentStep,
    selectedService,
    selectedDate,
    selectedTimeSlot,
    customerInfo,
    agreedToTerms,
    isLoading,
    isCalendarVisible,
    disabledDates,
    timeSlots,

    // Setters
    setSelectedService,
    setSelectedTimeSlot,
    setCustomerInfo,
    setAgreedToTerms,
    setIsCalendarVisible,
    handleDateSelect,

    // Actions
    handleNext,
    handlePrevious,
    handleSubmit,
    canProceedToNext,
  };
}
