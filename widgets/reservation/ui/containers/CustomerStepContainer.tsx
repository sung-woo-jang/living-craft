import { AccordionStep } from '@shared/ui/accordion-step';
import { useCallback } from 'react';
import { LayoutAnimation, View } from 'react-native';

import { useScrollContext } from '../../contexts';
import { useReservationValidation } from '../../hooks';
import { scheduleScrollToStep } from '../../lib';
import { useReservationStore } from '../../store';
import { CustomerInfoStep } from '../CustomerInfoStep';
import { CustomerSummary } from '../summaries/CustomerSummary';

export function CustomerStepContainer() {
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
  const canProceed = canProceedToNext('customer');

  // ===== 핸들러 =====
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleStepExpanded('customer');
  }, [toggleStepExpanded]);

  const handleComplete = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    completeStep('customer');

    // 자동 스크롤
    scheduleScrollToStep(scrollViewRef, stepRefs.current.confirmation);
  }, [completeStep, scrollViewRef, stepRefs]);

  const handleEdit = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    goToStep('customer');
    scheduleScrollToStep(scrollViewRef, stepRefs.current.customer);
  }, [goToStep, scrollViewRef, stepRefs]);

  const accordionStep = accordionSteps.customer!;

  return (
    <View
      ref={(ref) => {
        // eslint-disable-next-line react-hooks/immutability
        stepRefs.current.customer = ref;
      }}
    >
      <AccordionStep
        stepKey="customer"
        stepNumber={3}
        title="고객 정보"
        status={accordionStep.status}
        isExpanded={accordionStep.isExpanded}
        summaryContent={<CustomerSummary />}
        onToggle={accordionStep.status === 'completed' ? handleEdit : handleToggle}
        onComplete={handleComplete}
        isCompleteDisabled={!canProceed}
        hideCompleteButton={false}
      >
        <CustomerInfoStep withScrollView={false} />
      </AccordionStep>
    </View>
  );
}
