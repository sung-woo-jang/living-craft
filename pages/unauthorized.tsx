import { createRoute } from '@granite-js/react-native';
import { useLogin } from '@shared/hooks/useAuth';
import { Button, Text } from '@toss/tds-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const Route = createRoute('/unauthorized', {
  component: Page,
});

function Page() {
  const { isPending } = useLogin();

  /**
   * 토스 로그인 처리
   */
  const handleTossLogin = async () => {
    try {
      // Apps-in-Toss appLogin() 호출
      // TODO: Apps-in-Toss SDK 연동
      // const { authorizationCode } = await appLogin();

      // 임시: 개발 중에는 콘솔 로그만 출력
      console.log('Toss login button pressed');

      // 로그인 API 호출
      // login(
      //   { authorizationCode, referrer: 'DEFAULT' },
      //   {
      //     onSuccess: () => {
      //       // 홈으로 리다이렉트
      //       router.push('/');
      //     },
      //   }
      // );
    } catch (error) {
      console.error('Toss login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>리빙크래프트</Text>
        <Text style={styles.subtitle}>
          인테리어 필름, 유리 청소 등{'\n'}
          출장 서비스 예약 플랫폼
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleTossLogin} disabled={isPending} display="full">
          {isPending ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>토스 로그인</Text>}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
