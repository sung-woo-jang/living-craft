/**
 * Living Craft API Client
 * Axios 인스턴스 + 인터셉터
 */

import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '../store/authStore';
import { showErrorToast } from '../utils/toast';
import type { ErrorResponse, SuccessResponse } from './types';

/**
 * API 베이스 URL
 * 환경 변수에서 API_BASE_URL을 가져오거나 기본값 사용
 */
const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:8000/api';

// 디버깅용 로그
console.log('[API Client] Base URL:', API_BASE_URL);

/**
 * Axios 인스턴스 생성
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request 인터셉터
 * - Authorization 헤더 자동 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth 스토어에서 토큰 가져오기
    try {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response 인터셉터
 * - 성공 시 response.data.data 자동 추출 (SuccessResponse 언래핑)
 * - 401 에러 시 토큰 갱신 또는 로그아웃
 * - 에러 응답 파싱 및 Toast 표시
 */
apiClient.interceptors.response.use(
  (response) => {
    // SuccessResponse<T> 구조에서 data 자동 추출
    // response.data = { success: true, message: "...", data: {...}, timestamp: "..." }
    // 반환값 = response.data.data
    if (response.data && typeof response.data === 'object') {
      const successResponse = response.data as SuccessResponse<any>;
      if (successResponse.success && successResponse.data !== undefined) {
        // data를 response.data로 재할당하여 간편하게 사용
        response.data = successResponse.data;
      }
    }
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    // 에러 응답 파싱
    const errorResponse = error.response?.data;
    const statusCode = error.response?.status;
    const errorMessage = errorResponse?.message || '네트워크 오류가 발생했습니다.';

    // 401 Unauthorized - 토큰 만료
    if (statusCode === 401) {
      // TODO: 토큰 갱신 로직 구현
      // try {
      //   const refreshToken = useAuthStore.getState().refreshToken;
      //   if (refreshToken) {
      //     const newTokens = await refreshAccessToken(refreshToken);
      //     useAuthStore.getState().setTokens(newTokens.accessToken, newTokens.refreshToken);
      //
      //     // 원래 요청 재시도
      //     const originalRequest = error.config;
      //     if (originalRequest) {
      //       originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      //       return apiClient(originalRequest);
      //     }
      //   }
      // } catch (refreshError) {
      //   // 토큰 갱신 실패 - 로그아웃
      //   useAuthStore.getState().logout();
      //   // 로그인 페이지로 리다이렉트
      // }

      console.error('Unauthorized: Token expired or invalid');
      useAuthStore.getState().logout();
    }

    // 에러 Toast 표시
    showErrorToast(errorMessage);

    console.error('API Error:', {
      statusCode,
      message: errorMessage,
      path: errorResponse?.path,
    });

    return Promise.reject(error);
  }
);

/**
 * API 클라이언트 기본 export
 */
export default apiClient;
