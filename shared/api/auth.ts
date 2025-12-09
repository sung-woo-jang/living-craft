/**
 * Living Craft 인증 API
 */

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
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
