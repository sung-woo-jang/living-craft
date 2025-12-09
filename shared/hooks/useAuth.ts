/**
 * Living Craft 인증 훅
 */

import { useMutation } from '@tanstack/react-query';

import * as authApi from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { showErrorToast, showSuccessToast } from '../utils/toast';

/**
 * 로그인 훅
 */
export function useLogin() {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      authorizationCode,
      referrer = 'DEFAULT',
    }: {
      authorizationCode: string;
      referrer?: 'DEFAULT' | 'SANDBOX';
    }) => authApi.login(authorizationCode, referrer),
    onSuccess: (data) => {
      // 토큰 저장
      setTokens(data.accessToken, data.refreshToken);
      // 사용자 정보 저장
      setUser(data.user);
      showSuccessToast('로그인 되었습니다.');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      showErrorToast('로그인에 실패했습니다.');
    },
  });
}

/**
 * 로그아웃 훅
 */
export function useLogout() {
  const { logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 로컬 상태 초기화
      clearAuth();
      showSuccessToast('로그아웃 되었습니다.');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      clearAuth();
    },
  });
}

/**
 * 인증 여부 확인
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated());
}

/**
 * 현재 사용자 정보
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}
