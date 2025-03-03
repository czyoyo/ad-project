import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Shop, ShopFilter } from '../types/shop.types';
import ShopService from '../services/shop.service';
import { setFilters, clearFilters } from '../store/slices/shopSlice';
import { useGeolocation } from './index';
import { useDebounce } from './useDebounce';

/**
 * 상점 검색 결과 인터페이스
 */
interface SearchResults {
  shops: Shop[];
  totalCount: number;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 상점 검색 기능을 제공하는 커스텀 훅
 *
 * 검색어, 필터, 페이지네이션 등을 관리하고 상점 데이터를 가져옵니다.
 *
 * @param initialFilters 초기 필터 (선택적)
 * @returns 검색 결과, 상태, 필터 조작 함수
 */
function useShopSearch(initialFilters?: Partial<ShopFilter>) {
  const dispatch = useDispatch();
  const { location, getLocation } = useGeolocation();

  // Redux 상태에서 필터 가져오기
  const filters = useSelector((state: RootState) => state.shop.filters);

  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<SearchResults>({
    shops: [],
    totalCount: 0,
    page: 1,
    hasMore: false,
    isLoading: false,
    error: null,
  });

  // 검색 요청 취소를 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // 필터 디바운싱 (잦은 API 호출 방지)
  const debouncedFilters = useDebounce(filters, 500);

  // 검색 함수
  const searchShops = useCallback(async (searchFilters: ShopFilter, page: number = 1) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();

    setSearchResults((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // 상점 서비스 API 호출
      const result = await ShopService.getShops({
        ...searchFilters,
        page,
        limit: 12, // 한 페이지당 상점 수
      });

      // 첫 페이지인 경우 결과 초기화, 아니면 기존 결과에 추가
      if (page === 1) {
        setSearchResults({
          shops: result,
          totalCount: result.length,
          page,
          hasMore: result.length >= 12,
          isLoading: false,
          error: null,
        });
      } else {
        setSearchResults((prev) => ({
          shops: [...prev.shops, ...result],
          totalCount: prev.totalCount + result.length,
          page,
          hasMore: result.length >= 12,
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      // 요청이 취소된 경우는 에러로 처리하지 않음
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error('Shop search error:', error);

      setSearchResults((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '상점을 검색하는 중 오류가 발생했습니다.',
      }));
    }
  }, []);

  // 필터 변경 시 검색 실행
  useEffect(() => {
    searchShops(debouncedFilters, 1);

    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFilters, searchShops]);

  // 초기 필터 설정
  useEffect(() => {
    if (initialFilters) {
      dispatch(setFilters(initialFilters));
    }
  }, [dispatch, initialFilters]);

  /**
   * 필터 적용
   * @param newFilters 적용할 필터
   */
  const applyFilters = useCallback(
    (newFilters: Partial<ShopFilter>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  /**
   * 필터 초기화
   */
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  /**
   * 다음 페이지 로드
   */
  const loadMore = useCallback(() => {
    if (!searchResults.isLoading && searchResults.hasMore) {
      const nextPage = searchResults.page + 1;
      searchShops(filters, nextPage);
    }
  }, [filters, searchResults, searchShops]);

  /**
   * 현재 위치 기반 검색
   * @param radius 검색 반경 (km)
   */
  const searchNearby = useCallback(
    (radius: number = 5) => {
      if (!location) {
        getLocation();
        return;
      }

      applyFilters({
        latitude: location.latitude,
        longitude: location.longitude,
        distance: radius,
      });
    },
    [location, getLocation, applyFilters],
  );

  return {
    // 검색 결과
    shops: searchResults.shops,
    totalCount: searchResults.totalCount,
    hasMore: searchResults.hasMore,
    isLoading: searchResults.isLoading,
    error: searchResults.error,

    // 현재 필터
    filters,

    // 검색 조작 함수
    applyFilters,
    resetFilters,
    loadMore,
    searchNearby,

    // 위치 정보
    location,
    getLocation,
  };
}

export default useShopSearch;
