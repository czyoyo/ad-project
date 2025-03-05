import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CategoryList = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);

  // 더미 카테고리 데이터
  const categories = [
    { id: 1, name: '카페', slug: 'cafe' },
    { id: 2, name: '식당', slug: 'restaurant' },
    { id: 3, name: '서점', slug: 'bookstore' },
    { id: 4, name: '의류', slug: 'clothing' },
    { id: 5, name: '잡화', slug: 'goods' },
  ];

  // 더미 매장 목록
  const shops = [
    {
      id: 1,
      name: '커피샵 A',
      category: '카페',
      slug: 'cafe',
      image: 'https://placehold.co/600x400',
    },
    {
      id: 2,
      name: '레스토랑 B',
      category: '식당',
      slug: 'restaurant',
      image: 'https://placehold.co/600x400',
    },
    {
      id: 3,
      name: '서점 C',
      category: '서점',
      slug: 'bookstore',
      image: 'https://placehold.co/600x400',
    },
    {
      id: 4,
      name: '의류점 D',
      category: '의류',
      slug: 'clothing',
      image: 'https://placehold.co/600x400',
    },
  ];

  // 현재 카테고리에 맞는 매장 필터링
  const filteredShops = slug ? shops.filter((shop) => shop.slug === slug) : shops;

  useEffect(() => {
    // 실제 환경에서는 여기서 API 호출을 통해 데이터를 가져옴
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {slug
          ? `${categories.find((cat) => cat.slug === slug)?.name || '카테고리'}`
          : '모든 카테고리'}
      </h1>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          to="/categories"
          className={`px-4 py-2 rounded-full text-sm ${
            !slug
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          전체
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm ${
              category.slug === slug
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 mb-2">
                  {shop.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                <Link
                  to={`/shops/${shop.id}`}
                  className="mt-4 inline-block text-purple-600 dark:text-purple-400 hover:underline"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">이 카테고리에 등록된 매장이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
