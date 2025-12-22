import { useBackEvent } from '@granite-js/react-native';
import { ProgressStep, ProgressStepper } from '@shared/ui/progress-stepper';
import { colors } from '@toss/tds-colors';
import { BottomCTA, Button } from '@toss/tds-react-native';
import { ConfirmationStep, DEFAULT_FORM_VALUES, useReservationForm, useReservationStore } from '@widgets/reservation';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

interface ConfirmationPageProps {
  navigation: any;
}

export function ConfirmationPage({ navigation }: ConfirmationPageProps) {
  const backEvent = useBackEvent();

  const { formData, updateFormData, isLoading, reset: resetStore } = useReservationStore([
    'formData',
    'updateFormData',
    'isLoading',
    'reset',
  ]);

  const { methods, canProceedToNext, validateStep, handleSubmit } = useReservationForm({
    initialData: formData,
    onSubmitSuccess: () => {
      // 예약 완료 후 상태 초기화
      resetStore();
      methods.reset(DEFAULT_FORM_VALUES);
      // 홈으로 이동
      navigation.navigate('/' as never);
    },
  });

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
      return;
    }
    if (!validateStep('customer')) {
      Alert.alert('알림', '고객 정보를 먼저 입력해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('/reservation/customer' as never) },
      ]);
    }
  }, [navigation, validateStep]);

  // 로딩 중 뒤로가기 차단
  useEffect(() => {
    if (isLoading) {
      const handleBackPress = () => {
        Alert.alert('처리 중', '예약 처리가 진행 중입니다. 잠시만 기다려주세요.');
      };
      backEvent.addEventListener(handleBackPress);
      return () => backEvent.removeEventListener(handleBackPress);
    }
    return () => {};
  }, [isLoading, backEvent]);

  const handlePrevious = () => {
    navigation.navigate('/reservation/customer' as never);
  };

  const onSubmit = async () => {
    if (!canProceedToNext('confirmation')) {
      Alert.alert('알림', '이용약관에 동의해주세요.');
      return;
    }
    await handleSubmit();
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
        <ProgressStepper activeStepIndex={3}>
          <ProgressStep title="서비스" />
          <ProgressStep title="날짜/시간" />
          <ProgressStep title="정보입력" />
          <ProgressStep title="확인" />
        </ProgressStepper>

        <View style={styles.contentContainer}>
          <ConfirmationStep />
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
              disabled={!canProceedToNext('confirmation') || isLoading}
              loading={isLoading}
              onPress={onSubmit}
            >
              예약 완료
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
