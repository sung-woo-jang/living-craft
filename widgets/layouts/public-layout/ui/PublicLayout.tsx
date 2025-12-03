import { useNavigationState } from '@react-navigation/native';
import { colors } from '@toss/tds-colors';
import { useReservationStore } from '@widgets/reservation';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation } from './BottomNavigation';

// 예약 플로우 경로 목록
const RESERVATION_ROUTES = [
  '/reservation/service',
  '/reservation/datetime',
  '/reservation/customer',
  '/reservation/confirmation',
];

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { reset: resetReservation } = useReservationStore(['reset']);

  // 현재 라우트 감지
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name);

  // 예약 플로우 이탈 시 상태 초기화
  useEffect(() => {
    const isInReservationFlow = RESERVATION_ROUTES.some(route => currentRouteName === route);

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
    // 플로팅 탭바가 콘텐츠 위에 오버레이되도록 여백 제거
    // 각 페이지의 ScrollView/FlatList에서 contentContainerStyle로 하단 여백 처리
  },
});
