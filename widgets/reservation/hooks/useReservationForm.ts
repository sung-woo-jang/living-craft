import { useForm, UseFormReturn } from 'react-hook-form';
import { Alert } from 'react-native';

import { useReservationStore } from '../store/reservationStore';
import { DEFAULT_FORM_VALUES, ReservationFormData } from '../types';

interface UseReservationFormOptions {
  onSubmitSuccess?: () => void;
}

interface UseReservationFormReturn {
  // react-hook-form methods (FormProvider에 전달)
  methods: UseFormReturn<ReservationFormData>;

  // Actions
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => Promise<void>;
  handleDateSelect: (date: string) => void;
  canProceedToNext: () => boolean;
}

export function useReservationForm(options?: UseReservationFormOptions): UseReservationFormReturn {
  // react-hook-form
  const methods = useForm<ReservationFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { getValues, setValue } = methods;

  // zustand store
  const { currentStep, goToNextStep, goToPreviousStep, setIsLoading, updateTimeSlotsForDate } = useReservationStore([
    'currentStep',
    'goToNextStep',
    'goToPreviousStep',
    'setIsLoading',
    'updateTimeSlotsForDate',
  ]);

  const canProceedToNext = (): boolean => {
    const values = getValues();

    switch (currentStep) {
      case 'service':
        return values.service !== null;
      case 'datetime':
        return values.date !== '' && values.timeSlot !== null;
      case 'customer':
        return (
          values.customerInfo.name.trim() !== '' &&
          values.customerInfo.phone.trim() !== '' &&
          values.customerInfo.address.trim() !== ''
        );
      case 'confirmation':
        return values.agreedToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }
    goToNextStep();
  };

  const handlePrevious = () => {
    goToPreviousStep();
  };

  const handleSubmit = async () => {
    if (!canProceedToNext()) {
      Alert.alert('알림', '이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const values = getValues();
      const reservationData = {
        serviceId: values.service?.id,
        date: values.date,
        timeSlot: values.timeSlot?.time,
        customerInfo: values.customerInfo,
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
    setValue('date', date);
    setValue('timeSlot', null);
    updateTimeSlotsForDate(date);
  };

  return {
    methods,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleDateSelect,
    canProceedToNext,
  };
}
