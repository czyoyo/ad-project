// src/api/index.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authStorage } from '../utils/localStorage';
import AuthService from '../services/auth.service';
import env from '../config/environment';
import { ERROR_MESSAGES } from '../config/constants';
import { ApiResponse } from '../types/api.types';

/**
 * 기본 API 클라이언트 설정
 * API 요청 처리를 위한 Axios 인스턴스를 생성하고 설정합니다.
 */

// API 기본 URL
const API_URL = env.API_URL;

// API 요청 타임아웃 (밀리초)
const TIMEOUT = 30000;

// Axios 인스턴스 생성 및 설정
const baseApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청 인터셉터 설정
baseApi.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    // 로딩 상태 활성화 (Redux 상태 업데이트 등)
    // store.dispatch({ type: 'ui/setLoading', payload: true });

    // 인증 토큰 가져오기
    const token = authStorage.getToken();

    // 헤더에 인증 토큰 추가
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('API 요청 에러:', error);
    // store.dispatch({ type: 'ui/setLoading', payload: false });
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정
baseApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 로딩 상태 비활성화
    // store.dispatch({ type: 'ui/setLoading', payload: false });
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    // 로딩 상태 비활성화
    // store.dispatch({ type: 'ui/setLoading', payload: false });

    // 원본 요청 설정
    const originalRequest = error.config;

    // 토큰 만료 오류 처리 (401 에러)
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      try {
        // 토큰 갱신 재시도 플래그 설정
        (originalRequest as any)._retry = true;

        // 토큰 갱신 시도
        const refreshToken = authStorage.getRefreshToken();
        if (refreshToken) {
          const authService = new AuthService();
          const refreshResult = await authService.refreshToken();

          if (refreshResult && refreshResult.token) {
            // 새 토큰으로 헤더 업데이트
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${refreshResult.token}`,
            };

            // 원래 요청 재시도
            return baseApi(originalRequest);
          }
        }

        // 리프레시 토큰이 없거나 갱신에 실패한 경우
        AuthService.logout();
        // store.dispatch({ type: 'auth/logout' });

        // 토스트 메시지 표시
        // store.dispatch({
        //   type: 'ui/showToast',
        //   payload: {
        //     type: 'error',
        //     message: ERROR_MESSAGES.UNAUTHORIZED,
        //   },
        // });
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        AuthService.logout();
        // store.dispatch({ type: 'auth/logout' });
      }
    }

    // 에러 응답 처리
    let errorMessage = ERROR_MESSAGES.DEFAULT;

    if (error.response) {
      // 서버에서 응답을 받은 경우
      const responseData = error.response.data as ApiResponse<any>;

      if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else {
        // HTTP 상태 코드에 따른 기본 에러 메시지
        switch (error.response.status) {
          case 400:
            errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
            break;
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 403:
            errorMessage = ERROR_MESSAGES.FORBIDDEN;
            break;
          case 404:
            errorMessage = ERROR_MESSAGES.NOT_FOUND;
            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage = ERROR_MESSAGES.DEFAULT;
        }
      }
    } else if (error.request) {
      // 요청을 보냈지만 응답을 받지 못한 경우
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    // 에러 토스트 메시지 표시
    // store.dispatch({
    //   type: 'ui/showToast',
    //   payload: {
    //     type: 'error',
    //     message: errorMessage,
    //   },
    // });

    return Promise.reject(error);
  },
);

export default baseApi;
