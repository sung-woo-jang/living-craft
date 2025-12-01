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
  useReservationStore,
} from '@widgets/reservation';
import { FormProvider } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

export const Route = createRoute('/reservation', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  // zustand store에서 UI 상태 가져오기
  const { currentStep, isLoading } = useReservationStore(['currentStep', 'isLoading']);

  // react-hook-form 훅
  const { methods, handleNext, handlePrevious, handleSubmit, canProceedToNext } = useReservationForm({
    onSubmitSuccess: () => navigation.navigate('/' as never),
  });

  const renderStepContent = () => {
    switch (currentStep) {
      // 1단계: 서비스 선택
      case 'service':
        return <ServiceSelectionStep />;

      // 2단계: 날짜 및 시간 선택
      case 'datetime':
        return <DateTimeSelectionStep />;

      // 3단계: 고객 정보 입력
      case 'customer':
        return <CustomerInfoStep />;

      // 4단계: 예약 확인 및 약관 동의
      case 'confirmation':
        return <ConfirmationStep />;

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
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ProgressStepper activeStepIndex={STEP_ORDER.indexOf(currentStep)} checkForFinish>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <View style={styles.contentContainer}>{renderStepContent()}</View>

        <ReservationActions
          currentStep={currentStep}
          canProceed={canProceedToNext()}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      </View>
    </FormProvider>
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
