import { User } from '../types/user.types';
import { Shop, Review, Category } from '../types/shop.types';
import { vi } from 'vitest';

/**
 * 테스트 유틸리티 함수 모음
 * 테스트에 필요한 목 데이터, 테스트 헬퍼 함수 등을 제공합니다.
 */

/**
 * 테스트용 사용자 생성
 * @param overrides 기본 사용자 데이터를 덮어쓸 속성들
 */
export function mockUser(overrides?: Partial<User>): User {
  return {
    id: 'user-' + Math.floor(Math.random() * 10000),
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    nickname: `testuser${Math.floor(Math.random() * 10000)}`,
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: true,
    ...(overrides || {}),
  };
}

/**
 * 테스트용 상점 데이터 생성
 * @param overrides 기본 상점 데이터를 덮어쓸 속성들
 */
export function mockShop(overrides?: Partial<Shop>): Shop {
  return {
    id: 'shop-' + Math.floor(Math.random() * 10000),
    name: `테스트 성인용품점 ${Math.floor(Math.random() * 100)}`,
    description: '이것은 테스트를 위한 가상의 성인용품점입니다.',
    address: {
      street: '테스트 거리 123',
      city: '서울시',
      state: '서울특별시',
      zipCode: '12345',
      country: '대한민국',
      formattedAddress: '서울특별시 테스트구 테스트동 123',
    },
    location: {
      latitude: 37.5 + Math.random() * 0.1,
      longitude: 127 + Math.random() * 0.1,
      type: 'Point',
      coordinates: [127 + Math.random() * 0.1, 37.5 + Math.random() * 0.1],
    },
    contactInfo: {
      phone: '02-1234-5678',
      email: 'shop@example.com',
      website: 'https://example.com',
    },
    businessHours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '20:00' },
      sunday: { isOpen: false },
      holidays: {},
    },
    images: [
      {
        id: 'img-1',
        url: 'https://example.com/shop1.jpg',
        alt: '상점 외관',
        isFeatured: true,
        sortOrder: 1,
        type: 'exterior',
      },
    ],
    categories: ['adult-toys', 'lingerie'],
    tags: ['discreet', 'beginner-friendly'],
    rating: 4.5,
    reviewCount: 38,
    features: {
      hasParking: true,
      isWheelchairAccessible: true,
      hasPrivateRooms: false,
      acceptsCreditCards: true,
      hasFittingRooms: true,
      offersCurbsidePickup: false,
      hasWifi: true,
      isLGBTQFriendly: true,
      isDiscreet: true,
      hasExperiencedStaff: true,
      offersConsultations: true,
      additionalFeatures: ['coffee', 'workshops'],
    },
    priceRange: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
    ...(overrides || {}),
  };
}

/**
 * 테스트용 리뷰 데이터 생성
 * @param overrides 기본 리뷰 데이터를 덮어쓸 속성들
 */
export function mockReview(overrides?: Partial<Review>): Review {
  return {
    id: 'review-' + Math.floor(Math.random() * 10000),
    shopId: overrides?.shopId || 'shop-1234',
    userId: overrides?.userId || 'user-1234',
    nickname: overrides?.nickname || '리뷰 작성자',
    rating: overrides?.rating || Math.floor(Math.random() * 5) + 1,
    title: '매우 만족스러운 경험',
    content:
      '친절한 직원들과 다양한 제품 구성이 인상적이었습니다. 프라이버시를 존중해주는 분위기도 좋았습니다.',
    likes: Math.floor(Math.random() * 20),
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerifiedPurchase: true,
    ...(overrides || {}),
  };
}

/**
 * 테스트용 카테고리 데이터 생성
 * @param overrides 기본 카테고리 데이터를 덮어쓸 속성들
 */
export function mockCategory(overrides?: Partial<Category>): Category {
  return {
    id: 'category-' + Math.floor(Math.random() * 10000),
    name: `테스트 카테고리 ${Math.floor(Math.random() * 100)}`,
    description: '테스트용 카테고리입니다.',
    icon: 'category-icon',
    slug: `test-category-${Math.floor(Math.random() * 100)}`,
    isActive: true,
    sortOrder: Math.floor(Math.random() * 10),
    shopCount: Math.floor(Math.random() * 50),
    ...(overrides || {}),
  };
}

/**
 * 여러 개의 테스트용 상점 데이터 생성
 * @param count 생성할 상점 데이터 개수
 * @param baseOverrides 모든 상점에 적용할 공통 속성
 */
export function mockMultipleShops(count: number, baseOverrides?: Partial<Shop>): Shop[] {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      return mockShop({
        ...baseOverrides,
        id: `shop-${index + 1000}`,
        name: `테스트 성인용품점 ${index + 1}`,
      });
    });
}

/**
 * 테스트용 API 응답 생성
 * @param data 응답 데이터
 * @param code 상태 코드 (기본값: 200)
 * @param message 응답 메시지 (기본값: 'success')
 */
export function mockApiResponse<T>(data: T, code = 200, message = 'success') {
  return {
    data,
    code,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      processingTimeMs: Math.floor(Math.random() * 100),
    },
  };
}

/**
 * 페이지네이션이 있는 테스트용 API 응답 생성
 * @param data 응답 데이터 배열
 * @param page 현재 페이지 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 10)
 * @param totalItems 전체 항목 수
 */
export function mockPaginatedApiResponse<T>(
  data: T[],
  page = 1,
  limit = 10,
  totalItems = data.length + 20,
) {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    code: 200,
    message: 'success',
    meta: {
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
      timestamp: new Date().toISOString(),
      processingTimeMs: Math.floor(Math.random() * 100),
    },
  };
}

/**
 * 로컬 스토리지를 모킹하기 위한 유틸리티
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  };
};

/**
 * 성인용품점 등급 이름 포맷팅
 * @param rating 상점 등급 (1-5)
 */
export function formatRating(rating: number): string {
  const ratingMap: Record<number, string> = {
    1: '★☆☆☆☆ 실망스러움',
    2: '★★☆☆☆ 보통',
    3: '★★★☆☆ 좋음',
    4: '★★★★☆ 매우 좋음',
    5: '★★★★★ 최고',
  };

  const roundedRating = Math.round(rating);
  return ratingMap[roundedRating] || `${rating}점`;
}

/**
 * 테스트용 위치 정보 모킹
 */
export function mockGeolocation() {
  const getCurrentPosition = vi.fn().mockImplementation((success) => {
    success({
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
  });

  const watchPosition = vi.fn().mockImplementation((success) => {
    success({
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
    return 1; // watchPosition ID
  });

  const clearWatch = vi.fn();

  // global 대신 globalThis 사용
  Object.defineProperty(globalThis.navigator, 'geolocation', {
    value: { getCurrentPosition, watchPosition, clearWatch },
    writable: true,
  });

  return { getCurrentPosition, watchPosition, clearWatch };
}

/**
 * 테스트용 타이머 유틸리티
 */
export const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 테스트용 에러 응답 생성
 */
export function mockApiError(message = '오류가 발생했습니다', code = 500) {
  return {
    data: null,
    code,
    message,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

export default {
  mockUser,
  mockShop,
  mockReview,
  mockCategory,
  mockMultipleShops,
  mockApiResponse,
  mockPaginatedApiResponse,
  mockLocalStorage,
  formatRating,
  mockGeolocation,
  waitFor,
  mockApiError,
};
