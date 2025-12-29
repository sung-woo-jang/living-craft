import { useCreateReservation } from '@shared/hooks';
import { AccordionStep } from '@shared/ui/accordion-step';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, LayoutAnimation, View } from 'react-native';

import { useScrollContext } from '../../contexts';
import { useReservationValidation } from '../../hooks';
import { useReservationStore } from '../../store';
import type { ReservationFormData } from '../../types';
import { ConfirmationStep } from '../ConfirmationStep';

export function ConfirmationStepContainer() {
  // ===== Context =====
  const { stepRefs } = useScrollContext();

  // ===== Store =====
  const { accordionSteps, toggleStepExpanded, isLoading, update } = useReservationStore([
    'accordionSteps',
    'toggleStepExpanded',
    'isLoading',
    'update',
  ]);

  // ===== Form =====
  const { getValues } = useFormContext<ReservationFormData>();
  const { canProceedToNext } = useReservationValidation();
  const canProceed = canProceedToNext('confirmation');

  // ===== Data Mutation =====
  const { mutateAsync: createReservation } = useCreateReservation();

  // ===== 핸들러 =====
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleStepExpanded('confirmation');
  }, [toggleStepExpanded]);

  const handleSubmit = useCallback(async () => {
    if (!canProceed) {
      Alert.alert('알림', '이용약관에 동의해주세요.');
      return;
    }

    update({ isLoading: true });

    try {
      const values = getValues();

      // 필수 값 검증
      if (!values.service?.id) {
        throw new Error('서비스를 선택해주세요.');
      }
      if (!values.estimateDate || !values.estimateTimeSlot?.time) {
        throw new Error('견적 날짜와 시간을 선택해주세요.');
      }

      // API 명세서 형식에 맞게 데이터 평탄화
      const reservationData = {
        serviceId: values.service.id.toString(),
        estimateDate: values.estimateDate,
        estimateTime: values.estimateTimeSlot.time,
        address: values.customerInfo.address,
        detailAddress: values.customerInfo.detailAddress,
        customerName: values.customerInfo.name,
        customerPhone: values.customerInfo.phone,
        memo: values.customerInfo.memo,
        photos: values.customerInfo.photos.map((photo) => photo.previewUri),
      };

      // 실제 API 호출
      await createReservation(reservationData);

      Alert.alert('예약 완료', '예약이 성공적으로 완료되었습니다!');
    } catch (error) {
      const message = error instanceof Error ? error.message : '예약 처리 중 오류가 발생했습니다.';
      Alert.alert('오류', message);
    } finally {
      update({ isLoading: false });
    }
  }, [canProceed, getValues, createReservation, update]);

  const accordionStep = accordionSteps.confirmation!;

  return (
    <View ref={(ref) => (stepRefs.current.confirmation = ref)}>
      <AccordionStep
        stepKey="confirmation"
        stepNumber={4}
        title="예약 확인"
        status={accordionStep.status}
        isExpanded={accordionStep.isExpanded}
        onToggle={handleToggle}
      >
        <ConfirmationStep
          withScrollView={false}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isDisabled={!canProceed}
        />
      </AccordionStep>
    </View>
  );
}
