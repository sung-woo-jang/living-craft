import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { Asset } from '@toss/tds-react-native';
import { BOTTOM_NAV_ITEMS } from '../../../../shared/constants';

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

interface BottomNavigationProps {
  onMorePress: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onMorePress,
}) => {
  const navigation = TempRoute.useNavigation();
  // TODO: 실제 라우트 경로 추적 로직 필요
  const currentPath = '/';

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <View style={styles.bottomNav}>
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = !item.isMore && isActiveRoute(item.path);
        const iconColor = isActive ? colors.grey900 : colors.grey600;
        const textColor = isActive ? colors.grey900 : colors.grey600;

        if (item.isMore) {
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={onMorePress}
              accessibilityLabel={item.label}
            >
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW24}
                name={item.iconName!}
                color={iconColor}
              />
              <Text style={[styles.navLabel, { color: textColor }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.path}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => navigation.navigate(item.path as any)}
            accessibilityLabel={item.label}
          >
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              name={item.iconName!}
              color={iconColor}
            />
            <Text style={[styles.navLabel, { color: textColor }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // 활성 상태 추가 스타일 (필요시)
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
