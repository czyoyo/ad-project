// src/pages/Search/Search.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shop, ShopFilter } from '../../types/shop.types';
import { RootState } from '../../store/store';
import { useShopFilter, useGeolocation, useDebounce } from '../../hooks';
import ShopService from '../../services/shop.service';
import ShopCard from '../../components/shop/ShopCard/ShopCard';
import SearchFilters from '../../components/shop/SearchFilters/SearchFilters';
import Button from '../../components/ui/Button/Button';

const Search: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { filters, applyFilter, resetFilters } = useShopFilter();
  const { location: userLocation, getLocation } = useGeolocation();
  const searchFilters = useSelector((state: RootState) => state.shop.filters);

  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URL 검색 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const lat = searchParams.get('latitude');
    const lng = searchParams.get('longitude');

    const newFilters: Partial<ShopFilter> = {};

    if (query) newFilters.search = query;
    if (category) newFilters.category = category;
    if (lat && lng) {
      newFilters.latitude = parseFloat(lat);
      newFilters.longitude = parseFloat(lng);
    }

    applyFilter(newFilters);
  }, [location.search]);

  // 검색어 디바운싱
  const debouncedFilters = useDebounce(searchFilters, 500);

  // 필터 변경시 상점 검색
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await ShopService.getShops({
          ...debouncedFilters,
          page: 1,
          limit: 12,
        });
        setShops(shopsData || []);
        setTotalResults(shopsData.length || 0);
        setHasMore(shopsData.length >= 12);
        setPage(1);
      } catch (error) {
        console.error('Error fetching shops:', error);
        dispatch({
          type: 'ui/showToast',
          payload: {
            type: 'error',
            message: '상점 정보를 불러오는데 실패했습니다.',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [debouncedFilters, dispatch]);

  // 더 불러오기
  const handleLoadMore = async () => {
    const nextPage = page + 1;

    try {
      const moreShops = await ShopService.getShops({
        ...searchFilters,
        page: nextPage,
        limit: 12,
      });

      if (moreShops && moreShops.length > 0) {
        setShops([...shops, ...moreShops]);
        setHasMore(moreShops.length >= 12);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more shops:', error);
      dispatch({
        type: 'ui/showToast',
        payload: {
          type: 'error',
          message: '추가 상점을 불러오는데 실패했습니다.',
        },
      });
    }
  };

  // 위치 기반 검색
  const handleLocationSearch = () => {
    getLocation();
    if (userLocation) {
      applyFilter({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        distance: 5, // 5km 반경
      });
    }
  };

  // 필터 초기화
  const handleResetFilters = () => {
    resetFilters();
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchFilters.search
              ? `"${searchFilters.search}" 검색 결과`
              : searchFilters.category
                ? `${searchFilters.category} 카테고리`
                : '모든 성인용품점'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isLoading ? '검색 중...' : `총 ${totalResults}개의 결과`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            필터
          </Button>
          <Button variant="outline" size="sm" onClick={handleLocationSearch}>
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            내 주변
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            초기화
          </Button>
        </div>
      </div>

      {/* 필터 영역 */}
      {isFilterOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <SearchFilters
            currentFilters={searchFilters}
            onApplyFilters={applyFilter}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      )}

      {/* 상점 목록 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 animate-pulse h-64 rounded-lg"
            ></div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          {/* 더 불러오기 */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={handleLoadMore}>
                더 불러오기
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">검색 결과가 없습니다.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" onClick={handleResetFilters}>
              필터 초기화
            </Button>
            <Button variant="primary" onClick={handleLocationSearch}>
              내 주변 상점 찾기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
