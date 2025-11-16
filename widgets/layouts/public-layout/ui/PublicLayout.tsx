import { createRoute } from '@granite-js/react-native';
import { HEADER_NAV_ITEMS } from '@shared/constants';
import { Drawer } from '@shared/ui/drawer';
import { colors } from '@toss/tds-colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation } from './BottomNavigation';

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const navigation = TempRoute.useNavigation();
  const insets = useSafeAreaInsets();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigation.navigate(path as any);
    setIsDrawerOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header - Safe Area */}
      <View style={[styles.header, { paddingTop: insets.top }]} />

      {/* Main Content */}
      <View style={styles.mainContent}>{children}</View>

      {/* Bottom Navigation */}
      <BottomNavigation onMorePress={() => setIsDrawerOpen(true)} />

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <View style={styles.drawerNav}>
          {HEADER_NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.path}
              style={[styles.drawerNavItem, isActiveRoute(item.path) && styles.drawerNavItemActive]}
              onPress={() => handleNavigate(item.path)}
            >
              <Text style={[styles.drawerNavItemText, isActiveRoute(item.path) && styles.drawerNavItemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.drawerActions}>
          <TouchableOpacity style={styles.drawerActionBtn} onPress={() => handleNavigate('/reservation/search')}>
            <Text style={styles.drawerActionBtnText}>예약 조회</Text>
          </TouchableOpacity>
        </View>
      </Drawer>
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
  drawerNav: {
    gap: 4,
  },
  drawerNavItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  drawerNavItemActive: {
    backgroundColor: colors.grey100,
  },
  drawerNavItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grey700,
  },
  drawerNavItemTextActive: {
    color: colors.grey900,
    fontWeight: '700',
  },
  drawerActions: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  drawerActionBtn: {
    backgroundColor: colors.blue600,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  drawerActionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
