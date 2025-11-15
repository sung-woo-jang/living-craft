import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';

// 임시 라우트 생성 (네비게이션 훅 사용을 위해)
const TempRoute = createRoute('/_layout' as any, { component: () => null });

interface HeaderProps {
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  const navigation = TempRoute.useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('/' as any)}>
          <Text style={styles.logo}>리빙 크래프트</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.menuButton}
          accessibilityLabel="메뉴 열기"
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.grey900,
    letterSpacing: -0.5,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'space-around',
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.grey900,
    borderRadius: 1,
  },
});
