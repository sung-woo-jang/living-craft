import { createRoute } from '@granite-js/react-native';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import { CustomerInfoStep, useReservationForm, useReservationStore } from '@widgets/reservation';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

export const Route = createRoute('/reservation/customer', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const { formData, updateFormData, isLoading } = useReservationStore(['formData', 'updateFormData', 'isLoading']);

  const { methods, canProceedToNext, validateStep } = useReservationForm();

  // 마운트 시 store에서 폼 데이터 복원
  useEffect(() => {
    methods.reset(formData);
  }, []);

  // 폼 값 변경 시 store에 저장
  useEffect(() => {
    const subscription = methods.watch((value) => {
      updateFormData(value as Partial<typeof formData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  // 이전 단계 검증
  useEffect(() => {
    if (!validateStep('service')) {
      Alert.alert('알림', '서비스를 먼저 선택해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/service' as never) },
      ]);
      return;
    }
    if (!validateStep('datetime')) {
      Alert.alert('알림', '날짜와 시간을 먼저 선택해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/datetime' as never) },
      ]);
    }
  }, [navigation, validateStep]);

  const handlePrevious = () => {
    navigation.navigate('/reservation/datetime' as never);
  };

  const handleNext = () => {
    if (!canProceedToNext('customer')) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }
    navigation.navigate('/reservation/confirmation' as never);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <ProgressStepper activeStepIndex={2}>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <View style={styles.contentContainer}>
          <CustomerInfoStep />
        </View>

        <BottomCTA.Double
          leftButton={
            <Button
              type="light"
              style="weak"
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={isLoading}
              onPress={handlePrevious}
            >
              이전
            </Button>
          }
          rightButton={
            <Button
              display="full"
              containerStyle={{ borderRadius: 8 }}
              disabled={!canProceedToNext('customer') || isLoading}
              onPress={handleNext}
            >
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
