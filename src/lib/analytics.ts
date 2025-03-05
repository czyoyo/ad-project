// 환경 설정 가져오기
import env from '../config/environment';

/**
 * 애널리틱스 서비스 통합
 * 사용자 행동과 앱 성능을 추적하는 함수들을 제공합니다.
 */

// 이벤트 타입 정의
type EventCategory = 'user' | 'shop' | 'search' | 'navigation' | 'error' | 'performance';
type EventAction =
  | 'view'
  | 'click'
  | 'search'
  | 'filter'
  | 'favorite'
  | 'login'
  | 'register'
  | 'error'
  | 'load'
  | 'api_call';

interface EventParams {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  [key: string]: unknown;
}

interface PageViewParams {
  path: string;
  title?: string;
  referrer?: string;
}

// 개발 환경에서는 실제 호출하지 않고 콘솔에 로깅
const isDev = env.ENV === 'development';

// 기본 애널리틱스 데이터
const defaultData = {
  app_version: env.APP_VERSION,
  app_name: env.APP_NAME,
  platform: 'web',
};

/**
 * 이벤트 추적
 * @param params 이벤트 파라미터
 */
export const trackEvent = (params: EventParams): void => {
  const eventData = {
    ...defaultData,
    ...params,
    timestamp: new Date().toISOString(),
  };

  if (isDev) {
    console.log('[Analytics] Track Event:', eventData);
    return;
  }

  // Google Analytics 이벤트 추적 (구현 필요)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', params.action, {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
      non_interaction: params.nonInteraction,
    });
  }

  // 다른 애널리틱스 서비스 통합 (필요시 구현)
};

/**
 * 페이지 조회 추적
 * @param params 페이지 조회 파라미터
 */
export const trackPageView = (params: PageViewParams): void => {
  const pageData = {
    ...defaultData,
    ...params,
    timestamp: new Date().toISOString(),
  };

  if (isDev) {
    console.log('[Analytics] Page View:', pageData);
    return;
  }

  // Google Analytics 페이지 뷰 추적 (구현 필요)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: params.path,
      page_title: params.title,
      page_referrer: params.referrer,
    });
  }

  // 다른 애널리틱스 서비스 통합 (필요시 구현)
};

/**
 * 사용자 식별
 * @param userId 사용자 ID
 * @param userProperties 사용자 속성
 */
export const identifyUser = (userId: string, userProperties?: Record<string, unknown>): void => {
  const userData = {
    ...defaultData,
    user_id: userId,
    ...userProperties,
    timestamp: new Date().toISOString(),
  };

  if (isDev) {
    console.log('[Analytics] Identify User:', userData);
    return;
  }

  // Google Analytics 사용자 설정 (구현 필요)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...userProperties,
    });
  }

  // 다른 애널리틱스 서비스 통합 (필요시 구현)
};

/**
 * 에러 추적
 * @param error 에러 객체 또는 메시지
 * @param additionalInfo 추가 정보
 */
export const trackError = (
  error: Error | string,
  additionalInfo?: Record<string, unknown>,
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const errorData = {
    ...defaultData,
    error_message: errorMessage,
    error_stack: errorStack,
    ...additionalInfo,
    timestamp: new Date().toISOString(),
  };

  if (isDev) {
    console.error('[Analytics] Error:', errorData);
    return;
  }

  // Google Analytics 예외 추적 (구현 필요)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: additionalInfo?.fatal || false,
    });
  }

  // 에러 추적 서비스 통합 (ex: Sentry, 필요시 구현)
};

/**
 * 검색 이벤트 추적
 * @param query 검색어
 * @param resultsCount 결과 수
 * @param filters 적용된 필터
 */
export const trackSearch = (
  query: string,
  resultsCount: number,
  filters?: Record<string, unknown>,
): void => {
  trackEvent({
    category: 'search',
    action: 'search',
    label: query,
    value: resultsCount,
    filters,
  });
};

/**
 * 상점 조회 이벤트 추적
 * @param shopId 상점 ID
 * @param shopName 상점 이름
 */
export const trackShopView = (shopId: string, shopName: string): void => {
  trackEvent({
    category: 'shop',
    action: 'view',
    label: shopName,
    shop_id: shopId,
  });
};

/**
 * 즐겨찾기 이벤트 추적
 * @param shopId 상점 ID
 * @param shopName 상점 이름
 * @param isFavorite 즐겨찾기 상태
 */
export const trackFavorite = (shopId: string, shopName: string, isFavorite: boolean): void => {
  trackEvent({
    category: 'shop',
    action: 'favorite',
    label: shopName,
    shop_id: shopId,
    is_favorite: isFavorite,
  });
};

// 공개 API
export default {
  trackEvent,
  trackPageView,
  identifyUser,
  trackError,
  trackSearch,
  trackShopView,
  trackFavorite,
};

// TypeScript에서 window.gtag에 대한 타입 정의
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}
