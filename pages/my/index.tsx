import { createRoute, useNavigation } from '@granite-js/react-native';
import { MENU_ITEMS, MOCK_USER } from '@shared/constants';
import { useCurrentUser, useLogout } from '@shared/hooks/useAuth';
import { colors } from '@toss/tds-colors';
import { Asset, Button } from '@toss/tds-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my', {
  component: Page,
});

/**
 * 마이페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/users/me - 사용자 정보 조회
 */
function Page() {
  const navigation = useNavigation();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const currentUser = useCurrentUser();

  // 현재 사용자 정보 (API 연동 전까지는 Mock 데이터 사용)
  const user = currentUser || MOCK_USER;

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // 로그인 페이지로 리다이렉트
        navigation.navigate('/unauthorized' as any);
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{user.name[0]}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        {/* 메뉴 리스트 */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigation.navigate(item.path as any)}>
              <View style={styles.menuItemLeft}>
                <Asset.Icon name={item.iconName} frameShape={Asset.frameShape.CleanW24} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.menuArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.logoutSection}>
          <Button type="light" style="weak" display="full" onPress={handleLogout} disabled={isLoggingOut}>
            <Text style={styles.logoutButtonText}>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
  profileSection: {
    backgroundColor: 'white',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.grey600,
  },
  menuSection: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.grey600,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.red500,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuArrow: {
    fontSize: 24,
    color: colors.grey400,
  },
  logoutSection: {
    padding: 20,
    paddingTop: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey700,
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: colors.grey500,
  },
});
