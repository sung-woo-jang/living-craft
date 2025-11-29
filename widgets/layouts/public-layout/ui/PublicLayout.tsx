import { colors } from '@toss/tds-colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation } from './BottomNavigation';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

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
    marginTop: 10,
    marginBottom: 110,
    // 플로팅 탭바가 콘텐츠 위에 오버레이되도록 여백 제거
    // 각 페이지의 ScrollView/FlatList에서 contentContainerStyle로 하단 여백 처리
  },
});
