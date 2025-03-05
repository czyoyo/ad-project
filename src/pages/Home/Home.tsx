// src/pages/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Shop } from '../../types/shop.types';
import { RootState } from '../../store/store';
import { useGeolocation } from '../../hooks';
import ShopCard from '../../components/shop/ShopCard/ShopCard';
import CategoryList from '../../components/shop/CategoryList/CategoryList';
import Button from '../../components/ui/Button/Button';
import ShopService from '../../services/shop.service';

const Home: React.FC = () => {
  const { location, getLocation } = useGeolocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // 인기 상점 가져오기
        const popular = await ShopService.getPopularShops(8);
        setPopularShops(popular);

        // 사용자 위치가 있는 경우 근처 상점 가져오기
        if (location) {
          const nearby = await ShopService.getNearbyShops(
            location.latitude,
            location.longitude,
            5,
            8,
          );
          setNearbyShops(nearby);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [location]);

  // 위치 정보 접근 요청
  const handleLocationRequest = () => {
    getLocation();
  };

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="relative bg-purple-600 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
        <div className="relative py-16 px-8 md:py-24 md:px-12 max-w-7xl mx-auto text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">안전하고 편안한 성인용품점 찾기</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            신뢰할 수 있는 성인용품점 정보와 리뷰를 확인하고 나에게 맞는 매장을 쉽게 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="white" size="lg" onClick={() => handleLocationRequest()}>
              내 주변 상점 찾기
            </Button>
            <Link to="/categories">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-purple-600"
              >
                카테고리별 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">카테고리</h2>
          <Link to="/categories" className="text-purple-600 dark:text-purple-400 hover:underline">
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
            to="/search?sort=popular"
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

      {/* 주변 상점 섹션 */}
      {location && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">내 주변 성인용품점</h2>
            <Link
              to={`/search?latitude=${location.latitude}&longitude=${location.longitude}`}
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
          ) : nearbyShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                주변에 등록된 성인용품점이 없습니다.
              </p>
              <Button variant="outline" size="md" onClick={() => handleLocationRequest()}>
                위치 다시 가져오기
              </Button>
            </div>
          )}
        </section>
      )}

      {/* 가입 유도 섹션 (비로그인 사용자에게만 표시) */}
      {!isAuthenticated && (
        <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            더 많은 기능을 사용해보세요
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            회원가입하고 리뷰 작성, 즐겨찾기 등 다양한 기능을 이용해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button variant="primary" size="lg">
                지금 가입하기
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                로그인
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
