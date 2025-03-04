import baseApi from './base.api';
import { Shop, ShopFilter, Review, Category } from '../types/shop.types';
import { ApiResponse } from '../types/api.types';

/**
 * 성인용품점 API 요청 함수
 */
const adultShopApi = {
  /**
   * 성인용품점 목록 가져오기
   * @param filters 필터 조건
   */
  getShops: async (filters?: ShopFilter) => {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters) {
      // 필터 조건을 쿼리 파라미터로 변환
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'features' && Array.isArray(value)) {
            params[key] = (value as string[]).join(',');
          } else if (key === 'priceRange' && Array.isArray(value)) {
            params['minPrice'] = value[0];
            params['maxPrice'] = value[1];
          } else {
            params[key] = value as string | number | boolean;
          }
        }
      });
    }

    const response = await baseApi.get<ApiResponse<Shop[]>>('/shops', { params });
    return response.data;
  },

  /**
   * 특정 성인용품점 상세 정보 가져오기
   * @param id 성인용품점 ID
   */
  getShopById: async (id: string) => {
    const response = await baseApi.get<ApiResponse<Shop>>(`/shops/${id}`);
    return response.data;
  },

  /**
   * 성인용품점 리뷰 가져오기
   * @param shopId 성인용품점 ID
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   */
  getShopReviews: async (shopId: string, page = 1, limit = 10) => {
    const response = await baseApi.get<ApiResponse<Review[]>>(`/shops/${shopId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * 리뷰 작성하기
   * @param shopId 성인용품점 ID
   * @param reviewData 리뷰 데이터
   */
  addReview: async (
    shopId: string,
    reviewData: {
      rating: number;
      title?: string;
      content: string;
      images?: File[];
    },
  ) => {
    // 이미지가 있는 경우 FormData로 변환
    if (reviewData.images && reviewData.images.length > 0) {
      const formData = new FormData();
      formData.append('rating', reviewData.rating.toString());
      if (reviewData.title) formData.append('title', reviewData.title);
      formData.append('content', reviewData.content);

      reviewData.images.forEach((image, _) => {
        formData.append(`images`, image);
      });

      const response = await baseApi.post<ApiResponse<Review>>(
        `/shops/${shopId}/reviews`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } else {
      // 이미지가 없는 경우 일반 JSON 요청
      const response = await baseApi.post<ApiResponse<Review>>(
        `/shops/${shopId}/reviews`,
        reviewData,
      );
      return response.data;
    }
  },

  /**
   * 카테고리 목록 가져오기
   */
  getCategories: async () => {
    const response = await baseApi.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  /**
   * 성인용품점을 즐겨찾기에 추가
   * @param shopId 성인용품점 ID
   */
  addToFavorites: async (shopId: string) => {
    const response = await baseApi.post<ApiResponse<void>>(`/shops/${shopId}/favorites`);
    return response.data;
  },

  /**
   * 성인용품점을 즐겨찾기에서 제거
   * @param shopId 성인용품점 ID
   */
  removeFromFavorites: async (shopId: string) => {
    const response = await baseApi.delete<ApiResponse<void>>(`/shops/${shopId}/favorites`);
    return response.data;
  },

  /**
   * 사용자의 즐겨찾기 목록 가져오기
   */
  getFavorites: async () => {
    const response = await baseApi.get<ApiResponse<Shop[]>>('/user/favorites');
    return response.data;
  },

  /**
   * 사용자 위치 기반 주변 성인용품점 검색
   * @param latitude 위도
   * @param longitude 경도
   * @param radius 검색 반경 (km)
   */
  getNearbyShops: async (latitude: number, longitude: number, radius = 5) => {
    const response = await baseApi.get<ApiResponse<Shop[]>>('/shops/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  /**
   * 성인용품점 검색
   * @param query 검색어
   */
  searchShops: async (query: string) => {
    const response = await baseApi.get<ApiResponse<Shop[]>>('/shops/search', {
      params: { query },
    });
    return response.data;
  },

  /**
   * 추천 성인용품점 목록 가져오기
   */
  getRecommendedShops: async () => {
    const response = await baseApi.get<ApiResponse<Shop[]>>('/shops/recommended');
    return response.data;
  },

  /**
   * 인기 성인용품점 목록 가져오기
   */
  getPopularShops: async () => {
    const response = await baseApi.get<ApiResponse<Shop[]>>('/shops/popular');
    return response.data;
  },

  /**
   * 리뷰에 좋아요 표시
   * @param reviewId 리뷰 ID
   */
  likeReview: async (reviewId: string) => {
    const response = await baseApi.post<ApiResponse<void>>(`/reviews/${reviewId}/like`);
    return response.data;
  },

  /**
   * 리뷰에 싫어요 표시
   * @param reviewId 리뷰 ID
   */
  dislikeReview: async (reviewId: string) => {
    const response = await baseApi.post<ApiResponse<void>>(`/reviews/${reviewId}/dislike`);
    return response.data;
  },

  /**
   * 리뷰에 답글 작성
   * @param reviewId 리뷰 ID
   * @param content 답글 내용
   */
  addReviewReply: async (reviewId: string, content: string) => {
    const response = await baseApi.post<ApiResponse<void>>(`/reviews/${reviewId}/replies`, {
      content,
    });
    return response.data;
  },
};

export default adultShopApi;
