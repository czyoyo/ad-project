import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Shop } from '../../types/shop.types';
import ShopCard from '../../components/shop/ShopCard/ShopCard';
import shopDummyData from '../../data/shopDummyData';

// 성인용품점 검색 페이지 컴포넌트
const AdultShopList = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get('search') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);

  // 매장 카테고리 데이터
  const categories = [
    { id: 1, name: '전체 매장', slug: 'all' },
    { id: 2, name: '오프라인 매장', slug: 'offline' },
    { id: 3, name: '온라인 스토어', slug: 'online' },
    { id: 4, name: '백화점 매장', slug: 'department' },
    { id: 5, name: '24시간 매장', slug: '24hours' },
    { id: 6, name: '수입제품 전문', slug: 'imported' },
  ];

  // 카테고리와 검색어에 따라 상점 필터링
  useEffect(() => {
    setIsLoading(true);

    // 실제로는 API 호출로 대체될 부분
    // 지금은 더미 데이터를 사용하고 필터링
    setTimeout(() => {
      let result = [...shopDummyData];

      // 카테고리 필터
      if (categorySlug && categorySlug !== 'all') {
        result = result.filter((shop) => {
          // 카테고리 텍스트 매칭 (실제로는 카테고리 ID나 슬러그로 할 수 있음)
          const matchingCategory = shop.categories.some((cat) =>
            cat.toLowerCase().includes(categorySlug.toLowerCase()),
          );

          // 온라인/오프라인 매장 구분
          if (categorySlug === 'online') {
            // 온라인 매장은 주소에 www나 http가 포함되어 있거나 coordinates가 [0,0]인 경우
            return (
              matchingCategory ||
              shop.address.formattedAddress.includes('www') ||
              (shop.location.coordinates[0] === 0 && shop.location.coordinates[1] === 0)
            );
          }

          if (categorySlug === 'offline') {
            // 온라인이 아닌 모든 매장은 오프라인
            return (
              matchingCategory ||
              (!shop.address.formattedAddress.includes('www') &&
                !(shop.location.coordinates[0] === 0 && shop.location.coordinates[1] === 0))
            );
          }

          return matchingCategory;
        });
      }

      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter((shop) => {
          // 다양한 필드에서 검색
          return (
            shop.name.toLowerCase().includes(query) ||
            shop.description.toLowerCase().includes(query) ||
            shop.address.formattedAddress.toLowerCase().includes(query) ||
            shop.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            // 특징에서 검색
            Object.entries(shop.features).some(([key, value]) => {
              if (typeof value === 'boolean' && value) {
                // 불리언 특징이 true인 경우, 키 이름으로 검색
                return key.toLowerCase().includes(query);
              }
              return false;
            }) ||
            // 추가 특징에서 검색
            shop.features.additionalFeatures.some((feature) =>
              feature.toLowerCase().includes(query),
            )
          );
        });
      }

      setFilteredShops(result);
      setIsLoading(false);
    }, 800); // 로딩 시뮬레이션
  }, [categorySlug, searchQuery]);

  // 검색 폼 제출 처리
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // URL 파라미터 업데이트 (실제로는 useNavigate나 다른 방식으로 처리할 수 있음)
    const url = new URL(window.location.href);
    url.searchParams.set('search', searchQuery);
    window.history.pushState({}, '', url.toString());

    // 검색 실행 (이미 useEffect에서 searchQuery가 변경될 때 실행됨)
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {categorySlug && categorySlug !== 'all'
          ? `${categories.find((cat) => cat.slug === categorySlug)?.name || '성인용품점'}`
          : searchQuery
            ? `'${searchQuery}' 검색 결과`
            : '모든 성인용품점'}
      </h1>

      {/* 검색바 */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <input
            type="text"
            placeholder="매장명, 주소, 특징으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.slug === 'all' ? '/shops' : `/shops/${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm ${
              (category.slug === 'all' && !categorySlug) || category.slug === categorySlug
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 animate-pulse h-64 rounded-lg"
            ></div>
          ))}
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            조건에 맞는 성인용품점이 없습니다.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');

              // URL 파라미터 제거
              const url = new URL(window.location.href);
              url.searchParams.delete('search');
              window.history.pushState({}, '', url.toString());
            }}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            검색어 초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default AdultShopList;
