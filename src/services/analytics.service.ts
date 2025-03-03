// src/services/analytics.service.ts

import analytics from '../lib/analytics';
import { User } from '../types/user.types';
import { Shop } from '../types/shop.types';

/**
 * 애널리틱스 서비스
 * 사용자 행동과 앱 성능을 추적하는 메서드들을 제공합니다.
 */
class AnalyticsService {
  /**
   * 사용자 인증 이벤트 추적
   * @param eventType 이벤트 타입 (login, register, logout)
   * @param userId 사용자 ID
   */
  trackAuthEvent(eventType: 'login' | 'register' | 'logout', userId?: string): void {
    analytics.trackEvent({
      category: 'user',
      action: eventType as any,
      label: userId,
    });
  }

  /**
   * 사용자 식별
   * @param user 사용자 정보
   */
  identifyUser(user: User): void {
    analytics.identifyUser(user.id, {
      email: user.email,
      username: user.username,
      role: user.role,
      created_at: user.createdAt,
    });
  }

  /**
   * 페이지 조회 추적
   * @param path 페이지 경로
   * @param title 페이지 제목
   */
  trackPageView(path: string, title?: string): void {
    analytics.trackPageView({
      path,
      title,
    });
  }

  /**
   * 검색 이벤트 추적
   * @param query 검색어
   * @param resultsCount 결과 수
   * @param filters 적용된 필터
   */
  trackSearch(query: string, resultsCount: number, filters?: Record<string, any>): void {
    analytics.trackSearch(query, resultsCount, filters);
  }

  /**
   * 상점 조회 이벤트 추적
   * @param shop 상점 정보
   */
  trackShopView(shop: Shop): void {
    analytics.trackShopView(shop.id, shop.name);
  }

  /**
   * 즐겨찾기 이벤트 추적
   * @param shop 상점 정보
   * @param isFavorite 즐겨찾기 상태
   */
  trackFavorite(shop: Shop, isFavorite: boolean): void {
    analytics.trackFavorite(shop.id, shop.name, isFavorite);
  }

  /**
   * 필터 변경 이벤트 추적
   * @param filterType 필터 타입
   * @param filterValue 필터 값
   */
  trackFilterChange(filterType: string, filterValue: any): void {
    analytics.trackEvent({
      category: 'search',
      action: 'filter',
      label: filterType,
      value: typeof filterValue === 'string' ? undefined : filterValue,
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  /**
   * 에러 이벤트 추적
   * @param error 에러 객체 또는 메시지
   * @param context 에러 발생 컨텍스트
   */
  trackError(error: Error | string, context?: Record<string, any>): void {
    analytics.trackError(error, context);
  }

  /**
   * 사용자 행동 이벤트 추적
   * @param eventName 이벤트 이름
   * @param eventData 이벤트 데이터
   */
  trackUserAction(eventName: string, eventData?: Record<string, any>): void {
    analytics.trackEvent({
      category: 'user',
      action: 'click',
      label: eventName,
      ...eventData,
    });
  }

  /**
   * 성능 지표 추적
   * @param metricName 지표 이름
   * @param duration 소요 시간 (밀리초)
   */
  trackPerformance(metricName: string, duration: number): void {
    analytics.trackEvent({
      category: 'performance',
      action: 'load',
      label: metricName,
      value: duration,
    });
  }
}

export default new AnalyticsService();
