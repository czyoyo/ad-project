/**
 * 공통 유틸리티 타입 정의
 */

// ID 타입 (문자열 또는 숫자)
export type ID = string | number;

// 날짜/시간 관련 타입
export type ISODateString = string; // ISO 8601 형식의 날짜 문자열
export type TimestampMs = number; // UNIX 타임스탬프 (밀리초)

// 지역 및 언어 관련 타입
export type LanguageCode = string; // 'ko', 'en', 'ja' 등
export type CountryCode = string; // 'KR', 'US', 'JP' 등
export type CurrencyCode = string; // 'KRW', 'USD', 'JPY' 등

// 주소 관련 타입
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedAddress?: string;
}

// 지리적 위치 타입
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// GeoJSON Point 타입
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// 파일 관련 타입
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: ISODateString;
}

// 이미지 관련 타입
export interface ImageInfo extends FileInfo {
  width: number;
  height: number;
  alt?: string;
}

// 페이지네이션 요청 파라미터
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// 검색 파라미터
export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
}

// 결과 정렬 옵션
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

// 필터 옵션
export interface FilterOption<T = string | number | boolean> {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like';
  value: T | T[];
}

// 가격 범위 타입
export interface PriceRange {
  min: number;
  max: number;
  currency?: CurrencyCode;
}

// 날짜 범위 타입
export interface DateRange {
  start: ISODateString;
  end: ISODateString;
}

// 성공/실패 결과
export interface Result<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// 앱 알림 타입
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  timestamp: ISODateString;
  isRead: boolean;
  data?: Record<string, unknown>;
  link?: string;
}
// 디바이스 정보
export interface DeviceInfo {
  id: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'other';
  os: string;
  browser: string;
  ipAddress?: string;
  lastActive: ISODateString;
}
// Theme 관련 타입
export type ThemeMode = 'light' | 'dark' | 'system';

// 공통 상태 타입
export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

// 권한 타입
export type Permission =
  | 'read:shops'
  | 'write:shops'
  | 'delete:shops'
  | 'read:reviews'
  | 'write:reviews'
  | 'delete:reviews'
  | 'admin:access'
  | 'manage:users';

// 사용자 역할 타입
export type UserRole = 'user' | 'admin' | 'moderator' | 'guest';

// 역할별 권한 매핑
export const rolePermissions: Record<UserRole, Permission[]> = {
  guest: ['read:shops', 'read:reviews'],
  user: ['read:shops', 'write:reviews', 'read:reviews'],
  moderator: ['read:shops', 'write:shops', 'read:reviews', 'write:reviews', 'delete:reviews'],
  admin: [
    'read:shops',
    'write:shops',
    'delete:shops',
    'read:reviews',
    'write:reviews',
    'delete:reviews',
    'admin:access',
    'manage:users',
  ],
};
