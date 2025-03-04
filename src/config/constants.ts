/**
 * 애플리케이션 전반에서 사용되는 상수 값들을 정의합니다.
 */

// 애플리케이션 정보
export const APP_NAME = '성인용품점 추천 서비스';
export const APP_VERSION = '1.0.0';

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  FAVORITES: 'favorites',
  SEARCH_HISTORY: 'search_history',
  FILTER_PREFERENCES: 'filter_preferences',
};

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  SHOPS_PER_PAGE: 12,
  REVIEWS_PER_PAGE: 5,
};

// 상점 관련 상수
export const SHOP_CONSTANTS = {
  MAX_RATING: 5,
  DEFAULT_SEARCH_RADIUS: 5, // km
  MAX_SEARCH_RADIUS: 50, // km
  PRICE_RANGES: [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' },
    { value: 5, label: '$$$$$' },
  ],
  SORT_OPTIONS: [
    { value: 'rating', label: '평점순' },
    { value: 'distance', label: '거리순' },
    { value: 'reviewCount', label: '리뷰 많은순' },
    { value: 'priceRange', label: '가격 낮은순' },
    { value: '-priceRange', label: '가격 높은순' },
  ],
  SHOP_FEATURES: [
    { id: 'hasParking', label: '주차 가능', icon: 'parking' },
    { id: 'isWheelchairAccessible', label: '휠체어 접근 가능', icon: 'wheelchair' },
    { id: 'hasPrivateRooms', label: '개인실 구비', icon: 'room' },
    { id: 'acceptsCreditCards', label: '카드 결제 가능', icon: 'credit-card' },
    { id: 'hasFittingRooms', label: '피팅룸 구비', icon: 'fitting-room' },
    { id: 'offersCurbsidePickup', label: '도로변 픽업 가능', icon: 'pickup' },
    { id: 'hasWifi', label: '와이파이 제공', icon: 'wifi' },
    { id: 'isLGBTQFriendly', label: 'LGBTQ+ 친화적', icon: 'rainbow' },
    { id: 'isDiscreet', label: '비밀 보장', icon: 'privacy' },
    { id: 'hasExperiencedStaff', label: '전문 스태프 보유', icon: 'staff' },
    { id: 'offersConsultations', label: '상담 서비스 제공', icon: 'consultation' },
  ],
  SHOP_STATUS: {
    ACTIVE: '영업중',
    CLOSED: '영업 종료',
    TEMPORARILY_CLOSED: '일시 휴업',
    COMING_SOON: '오픈 예정',
    PERMANENTLY_CLOSED: '폐업',
  },
};

// 아바타 생성용 색상
export const AVATAR_COLORS = [
  'bg-red-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
];

// 테마 설정
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// API 관련 상수
export const API_CONSTANTS = {
  REQUEST_TIMEOUT: 30000, // 30초
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 5 * 60 * 1000, // 5분 (밀리초)
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
  UNAUTHORIZED: '인증에 실패했습니다. 다시 로그인해주세요.',
  FORBIDDEN: '이 작업을 수행할 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  VALIDATION_ERROR: '입력한 데이터가 유효하지 않습니다.',
  DEFAULT: '오류가 발생했습니다. 다시 시도해주세요.',
};

export default {
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  PAGINATION,
  SHOP_CONSTANTS,
  AVATAR_COLORS,
  THEMES,
  API_CONSTANTS,
  ERROR_MESSAGES,
};
