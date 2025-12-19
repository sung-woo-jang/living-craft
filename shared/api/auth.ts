/**
 * Living Craft 인증 API
 */

import { MOCK_LOGIN_RESPONSE, MOCK_REFRESH_RESPONSE, mockDelay } from '@shared/mocks';

import apiClient from './client';
import type { LoginResponse, RefreshTokenResponse } from './types';

/**
 * 로그인 (토스 앱 인증)
 * - Apps-in-Toss appLogin()으로 받은 authorizationCode로 로그인
 */
export async function login(
  authorizationCode: string,
  referrer: 'DEFAULT' | 'SANDBOX' = 'DEFAULT'
): Promise<LoginResponse> {
  // 개발 환경에서는 Mock 데이터 반환
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] POST /auth/login');
    await mockDelay();
    return {
      ...MOCK_LOGIN_RESPONSE,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }

  const response = await apiClient.post<LoginResponse>('/auth/login', {
    authorizationCode,
    referrer,
  });
  return response.data;
}

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  // 개발 환경에서는 Mock 데이터 반환
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] POST /auth/refresh');
    await mockDelay(300);
    return {
      ...MOCK_REFRESH_RESPONSE,
      accessToken: 'mock-access-token-refreshed-' + Date.now(),
      refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
    };
  }

  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  // 개발 환경에서는 로그만 출력
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('[Mock API] POST /auth/logout');
    await mockDelay(300);
    return;
  }

  await apiClient.post('/auth/logout');
}
