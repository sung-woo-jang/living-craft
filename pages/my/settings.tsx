import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/my/settings', {
  component: Page,
});

interface SettingItem {
  icon: string;
  title: string;
  subtitle?: string;
  action: () => void;
  destructive?: boolean;
}

/**
 * 설정 페이지
 *
 * 필요한 API 연결:
 * 1. POST /api/auth/logout - 로그아웃
 * 2. DELETE /api/users/me - 회원 탈퇴
 */
function Page() {
  const handleNotification = () => {
    Alert.alert('알림 설정', '알림 설정 기능이 곧 추가됩니다.');
  };

  const handlePrivacy = () => {
    Alert.alert('개인정보 처리방침', '개인정보 처리방침 내용을 표시합니다.');
  };

  const handleTerms = () => {
    Alert.alert('이용약관', '이용약관 내용을 표시합니다.');
  };

  const handleSupport = () => {
    Alert.alert('고객지원', '고객센터: 02-1234-5678\n이메일: contact@livingcraft.com\n운영시간: 평일 09:00 - 18:00');
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => Alert.alert('완료', '로그아웃 되었습니다.'),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('회원 탈퇴', '정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: () => Alert.alert('완료', '회원 탈퇴가 완료되었습니다.'),
      },
    ]);
  };

  const generalSettings: SettingItem[] = [
    {
      icon: '🔔',
      title: '알림 설정',
      subtitle: '예약, 리뷰 등의 알림을 설정합니다',
      action: handleNotification,
    },
    {
      icon: '🔒',
      title: '개인정보 처리방침',
      action: handlePrivacy,
    },
    {
      icon: '📋',
      title: '이용약관',
      action: handleTerms,
    },
    {
      icon: '💬',
      title: '고객지원',
      subtitle: '문의하기 및 도움말',
      action: handleSupport,
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      icon: '🚪',
      title: '로그아웃',
      action: handleLogout,
    },
    {
      icon: '⚠️',
      title: '회원 탈퇴',
      action: handleDeleteAccount,
      destructive: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
        </View>

        {/* 일반 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일반</Text>
          {generalSettings.map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingItem} onPress={item.action}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 계정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          {accountSettings.map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingItem} onPress={item.action}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Living Craft</Text>
          <Text style={styles.appVersion}>버전 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Living Craft. All rights reserved.</Text>
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grey600,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grey900,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.grey600,
    marginTop: 2,
  },
  destructiveText: {
    color: colors.red500,
  },
  settingArrow: {
    fontSize: 24,
    color: colors.grey400,
  },
  appInfo: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: colors.grey600,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: colors.grey500,
  },
});
