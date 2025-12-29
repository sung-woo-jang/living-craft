import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { ConfirmationStepContainer } from '@components/reservation/ConfirmationStepContainer';
import { CustomerStepContainer } from '@components/reservation/CustomerStepContainer';
import { DateTimeStepContainer } from '@components/reservation/DateTimeStepContainer';
import { ServiceStepContainer } from '@components/reservation/ServiceStepContainer';
import { ScrollProvider } from '@contexts';
import { useReservationForm } from '@hooks';
import { useReservationStore } from '@store';
import { DEFAULT_FORM_VALUES } from '@types';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';

export interface ReservationPageParams {
  serviceId?: string;
}

export const Route = createRoute<ReservationPageParams>('/reservation', {
  validateParams: (params): ReservationPageParams => {
    const rawParams = params as Record<string, unknown> | undefined;
    return {
      serviceId:
        typeof rawParams?.serviceId === 'string'
          ? rawParams.serviceId
          : typeof rawParams?.serviceId === 'number'
            ? String(rawParams.serviceId)
            : undefined,
    };
  },
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const params = Route.useParams();
  const serviceIdParam = params?.serviceId ? parseInt(params.serviceId, 10) : null;

  // ===== Store =====
  const { isLoading, reset: resetStore, resetAccordionSteps } = useReservationStore([
    'isLoading',
    'reset',
    'resetAccordionSteps',
  ]);

  // ===== Form =====
  const { methods } = useReservationForm({
    initialData: DEFAULT_FORM_VALUES,
    onSubmitSuccess: () => {
      resetStore();
      resetAccordionSteps();
      methods.reset(DEFAULT_FORM_VALUES);
      navigation.navigate('/' as never);
    },
  });

  // ===== 로딩 중 뒤로가기 차단 =====
  useEffect(() => {
    if (!isLoading) return;
    const handleBackPress = () => {
      Alert.alert('처리 중', '예약 처리가 진행 중입니다. 잠시만 기다려주세요.');
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [isLoading]);

  // ===== 로딩 상태 =====
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>예약을 처리하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <ScrollProvider>
        <View style={styles.container}>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            <ServiceStepContainer serviceIdParam={serviceIdParam} />
            <DateTimeStepContainer />
            <CustomerStepContainer />
            <ConfirmationStepContainer />
          </ScrollView>
        </View>
      </ScrollProvider>
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
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
});
