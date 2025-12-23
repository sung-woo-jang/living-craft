import { createRoute } from '@granite-js/react-native';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import { DateTimeSelectionStep, useReservationForm, useReservationStore } from '@widgets/reservation';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';

export const Route = createRoute('/reservation/datetime', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const {
    formData,
    updateFormData,
    // 견적 캘린더
    isEstimateCalendarVisible,
    closeEstimateCalendar,
  } = useReservationStore([
    'formData',
    'updateFormData',
    'isEstimateCalendarVisible',
    'closeEstimateCalendar',
  ]);

  const { methods, canProceedToNext, validateStep } = useReservationForm({ initialData: formData });

  // 폼 값 변경 시 store에 저장
  useEffect(() => {
    const subscription = methods.watch((value) => {
      updateFormData(value as Partial<typeof formData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  // 이전 단계 검증 (service 선택 여부)
  useEffect(() => {
    if (!validateStep('service')) {
      Alert.alert('알림', '서비스를 먼저 선택해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/service' as never) },
      ]);
    }
  }, [navigation, validateStep]);

  // 캘린더 열림 상태에서 뒤로가기 처리
  useEffect(() => {
    if (isEstimateCalendarVisible) {
      const handleBackPress = () => {
        closeEstimateCalendar();
        return true; // 뒤로가기 차단
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
    return () => {};
  }, [isEstimateCalendarVisible, closeEstimateCalendar]);

  const handlePrevious = () => {
    navigation.navigate('/reservation/service' as never);
  };

  const handleNext = () => {
    if (!canProceedToNext('datetime')) {
      Alert.alert('알림', '견적 및 시공 희망 날짜와 시간을 선택해주세요.');
      return;
    }
    navigation.navigate('/reservation/customer' as never);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ProgressStepper activeStepIndex={1}>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <View style={styles.contentContainer}>
          <DateTimeSelectionStep />
        </View>

        <BottomCTA.Double
          leftButton={
            <Button
              type="light"
              style="weak"
              display="full"
              containerStyle={{ borderRadius: 8 }}
              onPress={handlePrevious}
            >
              이전
            </Button>
          }
          rightButton={
            <Button display="full" containerStyle={{ borderRadius: 8 }} disabled={!canProceedToNext('datetime')} onPress={handleNext}>
              다음
            </Button>
          }
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
  contentContainer: {
    flex: 1,
  },
});
