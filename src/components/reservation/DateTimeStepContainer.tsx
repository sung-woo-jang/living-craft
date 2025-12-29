import { AccordionStep } from '@components/ui/accordion-step';
import { useCallback } from 'react';
import { LayoutAnimation, View } from 'react-native';

import { useScrollContext } from '@contexts';
import { useReservationValidation } from '@hooks';
import { scheduleScrollToStep } from '@utils';
import { useReservationStore } from '@store';
import { DateTimeSelectionStep } from './DateTimeSelectionStep';
import { DateTimeSummary } from '@components/reservation/DateTimeSummary';

export function DateTimeStepContainer() {
  // ===== Context =====
  const { scrollViewRef, stepRefs } = useScrollContext();

  // ===== Store =====
  const { accordionSteps, toggleStepExpanded, completeStep, goToStep } = useReservationStore([
    'accordionSteps',
    'toggleStepExpanded',
    'completeStep',
    'goToStep',
  ]);

  // ===== Validation =====
  const { canProceedToNext } = useReservationValidation();
  const canProceed = canProceedToNext('datetime');

  // ===== 핸들러 =====
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleStepExpanded('datetime');
  }, [toggleStepExpanded]);

  const handleComplete = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    completeStep('datetime');

    // 자동 스크롤
    scheduleScrollToStep(scrollViewRef, stepRefs.current.customer);
  }, [completeStep, scrollViewRef, stepRefs]);

  const handleEdit = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    goToStep('datetime');
    scheduleScrollToStep(scrollViewRef, stepRefs.current.datetime);
  }, [goToStep, scrollViewRef, stepRefs]);

  const accordionStep = accordionSteps.datetime!;

  return (
    <View
      ref={(ref) => {
        // eslint-disable-next-line react-hooks/immutability
        stepRefs.current.datetime = ref;
      }}
    >
      <AccordionStep
        stepKey="datetime"
        stepNumber={2}
        title="날짜/시간 선택"
        status={accordionStep.status}
        isExpanded={accordionStep.isExpanded}
        summaryContent={<DateTimeSummary />}
        onToggle={accordionStep.status === 'completed' ? handleEdit : handleToggle}
        onComplete={handleComplete}
        isCompleteDisabled={!canProceed}
        hideCompleteButton={false}
      >
        <DateTimeSelectionStep withScrollView={false} />
      </AccordionStep>
    </View>
  );
}
