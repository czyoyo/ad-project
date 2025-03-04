/**
 * 환경 변수 및 설정을 관리합니다.
 * 개발, 테스트, 운영 환경에 따라 다른 값을 사용할 수 있습니다.
 */

// 현재 환경
export const ENV = import.meta.env.MODE || 'development';

// 환경별 설정
const envConfig = {
  development: {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    DEBUG: true,
    MOCK_API: true,
  },
  test: {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    DEBUG: true,
    MOCK_API: true,
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://api.adultshopfinder.com',
    DEBUG: false,
    MOCK_API: false,
  },
};

// 현재 환경에 맞는 설정 선택
export const config = envConfig[ENV as keyof typeof envConfig] || envConfig.development;

// 공통 설정
export const COMMON_CONFIG = {
  APP_NAME: '성인용품점 추천 서비스',
  APP_VERSION: '1.0.0',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  DEFAULT_LANGUAGE: 'ko',
  DEFAULT_LOCATION: {
    latitude: 37.5665,
    longitude: 126.978, // 서울시청 좌표 (기본값)
  },
  MIN_SEARCH_RADIUS: 1, // km
  MAX_SEARCH_RADIUS: 50, // km
  DEFAULT_SEARCH_RADIUS: 5, // km
};

// 단일 객체로 내보내기
export default {
  ...config,
  ...COMMON_CONFIG,
  ENV,
  IS_DEV: ENV === 'development',
  IS_TEST: ENV === 'test',
  IS_PROD: ENV === 'production',
};
