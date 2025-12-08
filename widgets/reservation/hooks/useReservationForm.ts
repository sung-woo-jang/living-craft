import { useForm, UseFormReturn } from 'react-hook-form';
import { Alert } from 'react-native';

import { useReservationStore } from '../store';
import { DEFAULT_FORM_VALUES,ReservationFormData, StepKey } from '../types';

interface UseReservationFormOptions {
  onSubmitSuccess?: () => void;
}

interface UseReservationFormReturn {
  // react-hook-form methods (FormProvider에 전달)
  methods: UseFormReturn<ReservationFormData>;

  // Validation
  canProceedToNext: (step: StepKey) => boolean;
  validateStep: (step: StepKey) => boolean;

  // Actions
  handleSubmit: () => Promise<void>;
  handleDateSelect: (date: string) => void;
}

export function useReservationForm(options?: UseReservationFormOptions): UseReservationFormReturn {
  // react-hook-form
  const methods = useForm<ReservationFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { getValues, setValue, watch } = methods;

  // 폼 값 변경을 구독하여 버튼 상태 업데이트
  const watchedValues = watch();

  // zustand store
  const { setIsLoading, updateTimeSlotsForDate, availableServiceIds } = useReservationStore([
    'setIsLoading',
    'updateTimeSlotsForDate',
    'availableServiceIds',
  ]);

  /**
   * 특정 단계의 필수 입력값이 완료되었는지 검증 (watch 사용 - 리렌더링 트리거)
   */
  const canProceedToNext = (step: StepKey): boolean => {
    const values = watchedValues;
    const requiresTimeSelection = values.service?.requiresTimeSelection !== false;

    switch (step) {
      case 'service':
        // 서비스 선택 + 주소 입력 완료 + 지역에서 해당 서비스 가능 여부 확인
        return (
          values.service !== null &&
          values.customerInfo.address.trim() !== '' &&
          // 선택된 서비스가 현재 지역에서 가능한지 확인
          (availableServiceIds.length === 0 || availableServiceIds.includes(values.service.id))
        );
      case 'datetime':
        if (!requiresTimeSelection) {
          return values.date !== '';
        }
        return values.date !== '' && values.timeSlot !== null;
      case 'customer':
        // 이름, 연락처 필수 (주소는 service 단계에서 이미 입력됨)
        return values.customerInfo.name.trim() !== '' && values.customerInfo.phone.trim() !== '';
      case 'confirmation':
        return values.agreedToTerms;
      default:
        return false;
    }
  };

  /**
   * 특정 단계 완료 여부 확인 (getValues 사용 - 이전 단계 검증용)
   */
  const validateStep = (step: StepKey): boolean => {
    const values = getValues();
    const requiresTimeSelection = values.service?.requiresTimeSelection !== false;

    switch (step) {
      case 'service':
        // 서비스 선택 + 주소 입력 완료 + 지역에서 해당 서비스 가능 여부 확인
        return (
          values.service !== null &&
          values.customerInfo.address.trim() !== '' &&
          // 선택된 서비스가 현재 지역에서 가능한지 확인
          (availableServiceIds.length === 0 || availableServiceIds.includes(values.service.id))
        );
      case 'datetime':
        if (!requiresTimeSelection) {
          return values.date !== '';
        }
        return values.date !== '' && values.timeSlot !== null;
      case 'customer':
        // 이름, 연락처 필수 (주소는 service 단계에서 이미 입력됨)
        return values.customerInfo.name.trim() !== '' && values.customerInfo.phone.trim() !== '';
      case 'confirmation':
        return values.agreedToTerms;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNext('confirmation')) {
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
    canProceedToNext,
    validateStep,
    handleSubmit,
    handleDateSelect,
  };
}
