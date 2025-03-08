import { JSX, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Shop } from '../../types/shop.types';
import { RootState } from '../../store/store';
import ShopCard from '../../components/shop/ShopCard/ShopCard';
import CategoryList from '../../components/shop/CategoryList/CategoryList';
import Button from '../../components/ui/Button/Button';
// import ShopService from '../../services/shop.service';
import shopDummyData from '../../data/shopDummyData.ts';

function Home(): JSX.Element {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // 인기 상점 가져오기
        // const popular = await ShopService.getPopularShops(8);
        // setPopularShops(popular);
        setPopularShops(shopDummyData);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl overflow-hidden">
        <div className="relative py-16 px-8 md:py-24 md:px-12 max-w-7xl mx-auto text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">안전하고 편안한 성인용품점 찾기</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            신뢰할 수 있는 성인용품점 정보와 리뷰를 확인하고 나에게 맞는 매장을 쉽게 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/shops">
              <Button variant="white" size="lg" className="hover:text-purple-600">
                추천 매장 보기
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/20"
              >
                상품 검색하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">성인용품점 카테고리</h2>
          <Link to="/shops" className="text-purple-600 dark:text-purple-400 hover:underline">
            모두 보기
          </Link>
        </div>
        <CategoryList limit={6} />
      </section>

      {/* 인기 상점 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">인기 성인용품점</h2>
          <Link
            to="/shops?sort=popular"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            모두 보기
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 animate-pulse h-64 rounded-lg"
              ></div>
            ))}
          </div>
        ) : popularShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">인기 상점 정보를 불러올 수 없습니다.</p>
        )}
      </section>

      {/* 빠른 검색 섹션 */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            원하는 제품을 빠르게 검색하세요
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            다양한 브랜드와 품목의 성인용품을 한 번에 찾아보세요. 가격 비교도 가능합니다.
          </p>
          <form onSubmit={handleSearch} className="flex sm:mx-auto max-w-md shadow-sm">
            <input
              type="text"
              placeholder="제품명, 브랜드, 카테고리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-3 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-lg"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* 가입 유도 섹션 (비로그인 사용자에게만 표시) */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">더 많은 정보를 경험해보세요</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            회원가입하고 익명 리뷰 조회 및 작성을 사용해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button variant="white" size="lg" className="hover:text-purple-600">
                지금 가입하기
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/20"
              >
                로그인
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
