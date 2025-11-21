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
    backgroundColor: colors.grey50,
  },
  header: {
    backgroundColor: colors.grey50,
  },
  mainContent: {
    flex: 1,
  },
});
