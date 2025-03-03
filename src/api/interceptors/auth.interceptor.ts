import { InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store/store.ts';
import { setAuthLoading } from '../../store/slices/authSlice.ts';
import { getStoredToken } from '../../utils/localStorage.ts';

/**
 * 인증 인터셉터는 모든 API 요청에 JWT 토큰을 자동으로 추가합니다.
 * 이 인터셉터는 localStorage에서 토큰을 가져와 요청 헤더에 포함시킵니다.
 */
export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // 인증 요청 시작 시 로딩 상태 활성화 (Redux 사용 시)
  store.dispatch(setAuthLoading(true));

  // localStorage에서 토큰 가져오기
  const token = getStoredToken();

  // 토큰이 존재하는 경우 Authorization 헤더에 추가
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
