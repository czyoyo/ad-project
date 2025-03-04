import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authStorage } from '../utils/localStorage';
import AuthService from '../services/auth.service';
import { ApiResponse } from '../types/api.types';
import env from '../config/environment';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Axios 인스턴스와 관련 설정을 정의합니다.
 * API 요청에 필요한 기본 설정과 인터셉터를 포함합니다.
 */

// Axios 설정
const config: AxiosRequestConfig = {
  baseURL: env.API_URL,
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
  },
};

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create(config);

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = authStorage.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  },
);
// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 성공적인 응답 처리
    return response;
  },
  async (error: AxiosError) => {
    // 에러 응답 처리
    const originalRequest = error.config;

    // 401 에러(인증 실패)이고 원래 요청이 있는 경우
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      try {
        // 토큰 갱신 시도
        (originalRequest as any)._retry = true;
        const refreshResult = await AuthService.refreshToken();

        // 새 토큰으로 헤더 업데이트
        if (refreshResult && refreshResult.token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        console.error('Token refresh failed:', refreshError);
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }

    // 에러 메시지 처리
    let errorMessage = ERROR_MESSAGES.DEFAULT;

    if (error.response) {
      // 서버 응답이 있는 경우
      const responseData = error.response.data as ApiResponse<any>;

      if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else {
        // HTTP 상태 코드별 기본 메시지
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
      // 요청은 보냈지만 응답이 없는 경우
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    // 에러 객체에 메시지 추가
    error.message = errorMessage;

    return Promise.reject(error);
  },
);

// API 요청 헬퍼 함수
export const api = {
  /**
   * GET 요청
   * @param url 요청 URL
   * @param params URL 쿼리 파라미터
   * @param config 추가 Axios 설정
   */
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, {
      ...config,
      params,
    });
    return response.data.data as T;
  },

  /**
   * POST 요청
   * @param url 요청 URL
   * @param data 요청 바디 데이터
   * @param config 추가 Axios 설정
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PUT 요청
   * @param url 요청 URL
   * @param data 요청 바디 데이터
   * @param config 추가 Axios 설정
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PATCH 요청
   * @param url 요청 URL
   * @param data 요청 바디 데이터
   * @param config 추가 Axios 설정
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * DELETE 요청
   * @param url 요청 URL
   * @param config 추가 Axios 설정
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  },
};

export default axiosInstance;
