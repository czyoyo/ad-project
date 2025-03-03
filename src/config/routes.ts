// src/config/routes.ts

/**
 * 애플리케이션의 모든 라우트 경로를 정의합니다.
 * 이 파일을 사용하면 하드코딩된 경로 대신 상수를 사용할 수 있어 유지보수가 용이합니다.
 */

// 기본 경로
export const HOME = '/';
export const ABOUT = '/about';
export const CONTACT = '/contact';

// 인증 관련 경로
export const AUTH = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/reset-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email/:token',
};

// 사용자 관련 경로
export const USER = {
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  CHANGE_PASSWORD: '/profile/change-password',
  FAVORITES: '/favorites',
};

// 상점 관련 경로
export const SHOP = {
  LIST: '/shops',
  DETAIL: '/shops/:id',
  SEARCH: '/search',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: '/categories/:slug',
  MAP: '/map',
  NEARBY: '/nearby',
};

// 기타 경로
export const LEGAL = {
  TERMS: '/terms-of-service',
  PRIVACY: '/privacy-policy',
};

// 관리자 경로
export const ADMIN = {
  DASHBOARD: '/admin',
  SHOPS: '/admin/shops',
  SHOP_DETAIL: '/admin/shops/:id',
  USERS: '/admin/users',
  USER_DETAIL: '/admin/users/:id',
  CATEGORIES: '/admin/categories',
  REVIEWS: '/admin/reviews',
  STATISTICS: '/admin/statistics',
};

// 페이지 제목
export const PAGE_TITLES = {
  [HOME]: '홈',
  [ABOUT]: '서비스 소개',
  [CONTACT]: '문의하기',
  [AUTH.LOGIN]: '로그인',
  [AUTH.REGISTER]: '회원가입',
  [AUTH.FORGOT_PASSWORD]: '비밀번호 찾기',
  [AUTH.RESET_PASSWORD]: '비밀번호 재설정',
  [AUTH.VERIFY_EMAIL]: '이메일 인증',
  [USER.PROFILE]: '내 프로필',
  [USER.EDIT_PROFILE]: '프로필 수정',
  [USER.CHANGE_PASSWORD]: '비밀번호 변경',
  [USER.FAVORITES]: '즐겨찾기',
  [SHOP.LIST]: '성인용품점 목록',
  [SHOP.SEARCH]: '검색',
  [SHOP.CATEGORIES]: '카테고리',
  [SHOP.MAP]: '지도로 보기',
  [SHOP.NEARBY]: '내 주변 상점',
  [LEGAL.TERMS]: '이용약관',
  [LEGAL.PRIVACY]: '개인정보처리방침',
};

// 경로 생성 함수
export const generatePath = (path: string, params: Record<string, string | number> = {}) => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

export default {
  HOME,
  ABOUT,
  CONTACT,
  AUTH,
  USER,
  SHOP,
  LEGAL,
  ADMIN,
  PAGE_TITLES,
  generatePath,
};
