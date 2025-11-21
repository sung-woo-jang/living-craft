import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my', {
  component: Page,
});

interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
  path: string;
  badge?: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: '📅',
    title: '내 예약',
    subtitle: '예약 내역을 확인하세요',
    path: '/my/reservations',
    badge: 2,
  },
  {
    icon: '⭐',
    title: '내 리뷰',
    subtitle: '작성한 리뷰를 확인하세요',
    path: '/my/reviews',
    badge: 3,
  },
  {
    icon: '⚙️',
    title: '설정',
    subtitle: '앱 설정 및 정보',
    path: '/my/settings',
  },
];

/**
 * 마이페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/users/me - 사용자 정보 조회
 */
function Page() {
  const navigation = useNavigation();

  // Mock 사용자 정보
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.menuIcon}>{item.icon}</Text>
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

        {/* 빠른 액세스 */}
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>빠른 이동</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('/reservation/search')}>
              <Text style={styles.quickIcon}>🔍</Text>
              <Text style={styles.quickText}>예약 조회</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('/faq')}>
              <Text style={styles.quickIcon}>❓</Text>
              <Text style={styles.quickText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('/portfolio')}>
              <Text style={styles.quickIcon}>🛠️</Text>
              <Text style={styles.quickText}>포트폴리오</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>버전 1.0.0</Text>
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
    marginTop: 12,
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
  },
  menuIcon: {
    fontSize: 28,
    marginRight: 16,
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
  quickSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickText: {
    fontSize: 11,
    color: colors.grey700,
    textAlign: 'center',
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
