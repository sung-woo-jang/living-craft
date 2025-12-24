import { useNavigationState } from '@react-navigation/native';
import { colors } from '@toss/tds-colors';
import { useReservationStore } from '@widgets/reservation';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation } from './BottomNavigation';

// 예약 플로우 경로 목록 (통합 페이지)
const RESERVATION_ROUTES = ['/reservation'];

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { reset: resetReservation } = useReservationStore(['reset']);

  // 현재 라우트 감지
  const currentRouteName = useNavigationState((state) => state?.routes[state.index]?.name);

  // 예약 플로우 이탈 시 상태 초기화
  useEffect(() => {
    const isInReservationFlow = RESERVATION_ROUTES.some((route) => currentRouteName === route);

    if (!isInReservationFlow && currentRouteName) {
      resetReservation();
    }
  }, [currentRouteName, resetReservation]);

  return (
    <View style={styles.container}>
      {/* Header - Safe Area */}
      <View style={[styles.header, { paddingTop: insets.top }]} />

      {/* Main Content */}
      <View style={styles.mainContent}>{children}</View>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  header: {
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.greyBackground,
    // 각 페이지의 ScrollView에서 useBottomNavHeight()를 사용하여 contentContainerStyle에 paddingBottom 적용
  },
});
