// 기본 API 응답 인터페이스
export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  code: number;
  meta?: ApiResponseMeta;
}

// API 오류 인터페이스
export interface ApiError {
  code: number;
  message: string;
  details?: unknown;
  stack?: string; // 개발 환경에서만 포함됨
}

// 페이지네이션 메타 정보
export interface ApiResponseMeta {
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
  timestamp?: string;
  processingTimeMs?: number;
}

// API 호출 상태
export interface ApiCallState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
}

// API 호출 설정 옵션
export interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  withCredentials?: boolean;
  signal?: AbortSignal;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

// 파일 업로드 진행 상태
export interface UploadProgressInfo {
  loaded: number;
  total: number;
  percentage: number;
}

// API 캐시 설정
export interface ApiCacheOptions {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  key?: string;
}

// API 오류 코드 열거형
export enum ApiErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  NETWORK_ERROR = 0,
  TIMEOUT = -1,
  UNKNOWN_ERROR = -99,
}

// API 요청 메서드
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API 요청 인터페이스
export interface ApiRequest<T = unknown> {
  url: string;
  method: ApiMethod;
  data?: T;
  options?: ApiOptions;
  cache?: ApiCacheOptions;
}

// GraphQL 관련 타입 (API가 GraphQL을 사용하는 경우)
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
}

// 웹소켓 관련 타입 (실시간 기능이 있는 경우)
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}
