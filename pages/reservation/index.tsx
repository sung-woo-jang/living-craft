import { createRoute } from '@granite-js/react-native';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import {
  ConfirmationStep,
  CustomerInfoStep,
  DateTimeSelectionStep,
  ReservationActions,
  ServiceSelectionStep,
  STEP_ORDER,
  useReservationForm,
} from '@widgets/reservation';
import { StyleSheet, Text, View } from 'react-native';

export const Route = createRoute('/reservation', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const form = useReservationForm({
    onSubmitSuccess: () => navigation.navigate('/' as any),
  });

  const renderStepContent = () => {
    switch (form.currentStep) {
      // 1단계: 서비스 선택
      case 'service':
        return <ServiceSelectionStep selectedService={form.selectedService} onSelect={form.setSelectedService} />;

      // 2단계: 날짜 및 시간 선택
      case 'datetime':
        return (
          <DateTimeSelectionStep
            selectedDate={form.selectedDate}
            selectedTimeSlot={form.selectedTimeSlot}
            timeSlots={form.timeSlots}
            disabledDates={form.disabledDates}
            isCalendarVisible={form.isCalendarVisible}
            onDateSelect={form.handleDateSelect}
            onTimeSlotSelect={form.setSelectedTimeSlot}
            onCalendarOpen={() => form.setIsCalendarVisible(true)}
            onCalendarClose={() => form.setIsCalendarVisible(false)}
          />
        );

      // 3단계: 고객 정보 입력
      case 'customer':
        return <CustomerInfoStep customerInfo={form.customerInfo} onCustomerInfoChange={form.setCustomerInfo} />;

      // 4단계: 예약 확인 및 약관 동의
      case 'confirmation':
        return (
          <ConfirmationStep
            selectedService={form.selectedService}
            selectedDate={form.selectedDate}
            selectedTimeSlot={form.selectedTimeSlot}
            customerInfo={form.customerInfo}
            agreedToTerms={form.agreedToTerms}
            onAgreeChange={form.setAgreedToTerms}
          />
        );

      default:
        return null;
    }
  };

  if (form.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>예약을 처리하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressStepper activeStepIndex={STEP_ORDER.indexOf(form.currentStep)} checkForFinish>
        <ProgressStep title="서비스" />
        <ProgressStep title="날짜/시간" />
        <ProgressStep title="정보입력" />
        <ProgressStep title="확인" />
      </ProgressStepper>

      <View style={styles.contentContainer}>{renderStepContent()}</View>

      <ReservationActions
        currentStep={form.currentStep}
        canProceed={form.canProceedToNext()}
        onNext={form.handleNext}
        onPrevious={form.handlePrevious}
        onSubmit={form.handleSubmit}
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
});
