import axiosInstance from '../api/base.api';
import { Shop, ShopFilter, Review, Category } from '../types/shop.types';
import { ApiResponse } from '../types/api.types';

/**
 * 상점 관련 서비스
 */
class ShopService {
  private API_URL = '/shops';

  /**
   * 상점 목록 가져오기
   * @param filters 필터링 조건
   */
  async getShops(filters?: ShopFilter): Promise<Shop[]> {
    try {
      // 필터 파라미터 구성
      const params: Record<string, string | number | boolean | undefined> = {};

      if (filters) {
        if (filters.category) params.category = filters.category;
        if (filters.location) params.location = filters.location;
        if (filters.distance) params.distance = filters.distance;
        if (filters.latitude) params.latitude = filters.latitude;
        if (filters.longitude) params.longitude = filters.longitude;
        if (filters.rating) params.rating = filters.rating;
        if (filters.search) params.search = filters.search;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortDirection) params.sortDirection = filters.sortDirection;
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.isOpen !== undefined) params.isOpen = filters.isOpen;

        // 특징 필터링
        if (filters.features && filters.features.length > 0) {
          params.features = filters.features.join(',');
        }

        // 가격 범위 필터링
        if (filters.priceRange && filters.priceRange.length === 2) {
          params.minPrice = filters.priceRange[0];
          params.maxPrice = filters.priceRange[1];
        }
      }

      const response = await axiosInstance.get<ApiResponse<Shop[]>>(this.API_URL, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Get shops error:', error);
      throw error;
    }
  }

  /**
   * 상점 상세 정보 가져오기
   * @param shopId 상점 ID
   */
  async getShopById(shopId: string): Promise<Shop> {
    try {
      const response = await axiosInstance.get<ApiResponse<Shop>>(`${this.API_URL}/${shopId}`);
      return response.data.data as Shop;
    } catch (error) {
      console.error(`Get shop ${shopId} error:`, error);
      throw error;
    }
  }

  /**
   * 상점 리뷰 가져오기
   * @param shopId 상점 ID
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   */
  async getShopReviews(shopId: string, page = 1, limit = 10): Promise<Review[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Review[]>>(
        `${this.API_URL}/${shopId}/reviews`,
        { params: { page, limit } },
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Get shop ${shopId} reviews error:`, error);
      throw error;
    }
  }

  /**
   * 리뷰 작성하기
   * @param shopId 상점 ID
   * @param reviewData 리뷰 데이터
   */
  async addReview(
    shopId: string,
    reviewData: Omit<
      Review,
      | 'id'
      | 'shopId'
      | 'userId'
      | 'nickname'
      | 'userImage'
      | 'createdAt'
      | 'updatedAt'
      | 'isVerifiedPurchase'
      | 'userReaction'
      | 'replies'
    >,
  ): Promise<Review> {
    try {
      const response = await axiosInstance.post<ApiResponse<Review>>(
        `${this.API_URL}/${shopId}/reviews`,
        reviewData,
      );
      return response.data.data as Review;
    } catch (error) {
      console.error(`Add review for shop ${shopId} error:`, error);
      throw error;
    }
  }

  /**
   * 카테고리 목록 가져오기
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * 상점 즐겨찾기에 추가
   * @param shopId 상점 ID
   */
  async addFavorite(shopId: string): Promise<void> {
    try {
      await axiosInstance.post<ApiResponse<void>>(`${this.API_URL}/${shopId}/favorite`);
    } catch (error) {
      console.error(`Add shop ${shopId} to favorites error:`, error);
      throw error;
    }
  }

  /**
   * 상점 즐겨찾기에서 제거
   * @param shopId 상점 ID
   */
  async removeFavorite(shopId: string): Promise<void> {
    try {
      await axiosInstance.delete<ApiResponse<void>>(`${this.API_URL}/${shopId}/favorite`);
    } catch (error) {
      console.error(`Remove shop ${shopId} from favorites error:`, error);
      throw error;
    }
  }

  /**
   * 사용자 즐겨찾기 목록 가져오기
   */
  async getFavorites(): Promise<Shop[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Shop[]>>('/favorites');
      return response.data.data || [];
    } catch (error) {
      console.error('Get favorites error:', error);
      throw error;
    }
  }

  /**
   * 근처 상점 찾기
   * @param latitude 위도
   * @param longitude 경도
   * @param radius 반경 (km)
   * @param limit 결과 개수
   */
  async getNearbyShops(
    latitude: number,
    longitude: number,
    radius = 5,
    limit = 10,
  ): Promise<Shop[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Shop[]>>(`${this.API_URL}/nearby`, {
        params: { latitude, longitude, radius, limit },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get nearby shops error:', error);
      throw error;
    }
  }

  /**
   * 인기 상점 가져오기
   * @param limit 결과 개수
   */
  async getPopularShops(limit = 10): Promise<Shop[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Shop[]>>(`${this.API_URL}/popular`, {
        params: { limit },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get popular shops error:', error);
      throw error;
    }
  }
}

export default new ShopService();
