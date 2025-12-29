import { useServices } from '@hooks';
import { AccordionStep } from '@components/ui/accordion-step';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { LayoutAnimation, View } from 'react-native';

import { getServiceableRegionsForService } from '@api';
import { useScrollContext } from '@contexts';
import { useReservationValidation } from '@hooks';
import { scheduleScrollToStep } from '@utils';
import { useReservationStore } from '@store';
import type { ReservationFormData } from '@types';
import { ServiceSelectionStep } from './ServiceSelectionStep';
import { ServiceSummary } from './ServiceSummary';
import { AddressManagementSection } from './AddressManagementSection';

interface ServiceStepContainerProps {
  serviceIdParam?: number | null;
}

export function ServiceStepContainer({ serviceIdParam }: ServiceStepContainerProps) {
  // ===== Context =====
  const { scrollViewRef, stepRefs } = useScrollContext();

  // ===== Store =====
  const {
    accordionSteps,
    toggleStepExpanded,
    completeStep,
    goToStep,
    resetAddressSearch,
    resetEstimateFeeInfo,
  } = useReservationStore([
    'accordionSteps',
    'toggleStepExpanded',
    'completeStep',
    'goToStep',
    'resetAddressSearch',
    'resetEstimateFeeInfo',
  ]);

  // ===== Form =====
  const { setValue, watch } = useFormContext<ReservationFormData>();
  const { canProceedToNext } = useReservationValidation();

  // ===== Data Fetching =====
  const { data: services } = useServices();

  // ===== Computed =====
  const currentService = watch('service');
  const currentAddress = watch('customerInfo.address');
  const hasAddress = Boolean(currentAddress?.trim());
  const canProceed = canProceedToNext('service') && hasAddress;

  const filteredRegions = useMemo(() => {
    if (!currentService || !services) return [];
    return getServiceableRegionsForService(services, currentService.id);
  }, [currentService, services]);

  // ===== Refs =====
  const paramsProcessedRef = useRef(false);
  const prevServiceIdRef = useRef<number | null>(null);

  // ===== 핸들러 =====
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleStepExpanded('service');
  }, [toggleStepExpanded]);

  const handleComplete = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    completeStep('service');

    // 자동 스크롤
    scheduleScrollToStep(scrollViewRef, stepRefs.current.datetime);
  }, [completeStep, scrollViewRef, stepRefs]);

  const handleEdit = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    goToStep('service');
    scheduleScrollToStep(scrollViewRef, stepRefs.current.service);
  }, [goToStep, scrollViewRef, stepRefs]);

  // ===== 서비스 변경 시 주소 초기화 핸들러 =====
  const resetAddressState = useCallback(() => {
    resetAddressSearch();
    resetEstimateFeeInfo();
    setValue('customerInfo.address', '');
    setValue('customerInfo.detailAddress', '');
  }, [resetAddressSearch, resetEstimateFeeInfo, setValue]);

  // ===== Query params 기반 서비스 자동 선택 =====
  useEffect(() => {
    if (currentService) return;
    if (paramsProcessedRef.current) return;

    if (serviceIdParam && services && services.length > 0) {
      const targetService = services.find((s) => s.id === serviceIdParam);
      if (targetService) {
        setValue('service', targetService);
        paramsProcessedRef.current = true;
      }
    }
  }, [serviceIdParam, services, currentService, setValue]);

  // ===== 서비스 변경 감지 =====
  useEffect(() => {
    if (!currentService) {
      prevServiceIdRef.current = null;
      return;
    }

    if (prevServiceIdRef.current !== null && prevServiceIdRef.current !== currentService.id) {
      resetAddressState();
    }

    prevServiceIdRef.current = currentService.id;
  }, [currentService?.id, resetAddressState]);

  const accordionStep = accordionSteps.service!;

  return (
    <View
      ref={(ref) => {
        // eslint-disable-next-line react-hooks/immutability
        stepRefs.current.service = ref;
      }}
    >
      <AccordionStep
        stepKey="service"
        stepNumber={1}
        title="서비스 선택"
        status={accordionStep.status}
        isExpanded={accordionStep.isExpanded}
        summaryContent={<ServiceSummary />}
        onToggle={accordionStep.status === 'completed' ? handleEdit : handleToggle}
        onComplete={handleComplete}
        isCompleteDisabled={!canProceed || !hasAddress}
        hideCompleteButton={false}
      >
        <ServiceSelectionStep withScrollView={false} />
        <AddressManagementSection
          currentService={currentService}
          services={services}
          filteredRegions={filteredRegions}
        />
      </AccordionStep>
    </View>
  );
}
