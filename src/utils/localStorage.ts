/**
 * JWT 토큰을 안전하게 관리하기 위한 유틸리티 함수들입니다.
 */

// 토큰을 저장하는 키
const TOKEN_KEY = 'auth_token';

/**
 * 토큰을 localStorage에 저장합니다.
 */
export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * localStorage에서 토큰을 가져옵니다.
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * localStorage에서 토큰을 제거합니다.
 */
export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
