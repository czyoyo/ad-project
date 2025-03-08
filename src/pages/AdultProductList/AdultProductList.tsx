import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 데이터 타입 정의
interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  discountPrice?: number;
  rating: number;
  imageUrl: string;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

const AdultProductList = () => {
  // 샘플 카테고리 데이터
  const categories: Category[] = [
    {
      id: 'toys',
      name: '성인용품',
      subcategories: ['진동기', '마사지기', '러브돌', '콘돔', '러브젤'],
    },
    {
      id: 'lingerie',
      name: '란제리',
      subcategories: ['브라', '팬티', '가터벨트', '코스프레', '바디슈트'],
    },
    {
      id: 'wellness',
      name: '웰니스',
      subcategories: ['영양제', '마사지오일', '향초', '페로몬'],
    },
    {
      id: 'bondage',
      name: 'BDSM',
      subcategories: ['수갑', '채찍', '안대', '바인더'],
    },
  ];

  // 샘플 제품 데이터
  const allProducts: Product[] = [
    {
      id: 1,
      name: '프리미엄 진동기 S1',
      category: 'toys',
      subcategory: '진동기',
      price: 89000,
      discountPrice: 69000,
      rating: 4.8,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Vibrator+S1',
      tags: ['방수', '충전식', '저소음'],
      isNew: true,
    },
    {
      id: 2,
      name: '실크 레이스 브라 세트',
      category: 'lingerie',
      subcategory: '브라',
      price: 59000,
      rating: 4.5,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Bra+Set',
      tags: ['실크', '레이스', '편안함'],
      isBestseller: true,
    },
    {
      id: 3,
      name: '프리미엄 마사지 오일',
      category: 'wellness',
      subcategory: '마사지오일',
      price: 32000,
      rating: 4.7,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Massage+Oil',
      tags: ['천연', '무향', '보습'],
    },
    {
      id: 4,
      name: '고급 가죽 수갑',
      category: 'bondage',
      subcategory: '수갑',
      price: 45000,
      rating: 4.6,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Leather+Cuffs',
      tags: ['가죽', '조절가능', '패딩'],
    },
    {
      id: 5,
      name: '프리미엄 콘돔 세트',
      category: 'toys',
      subcategory: '콘돔',
      price: 15000,
      discountPrice: 12000,
      rating: 4.9,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Condom+Set',
      tags: ['천연', '울트라씬', '향기'],
      isBestseller: true,
    },
    {
      id: 6,
      name: '섹시 코스프레 의상',
      category: 'lingerie',
      subcategory: '코스프레',
      price: 68000,
      rating: 4.4,
      imageUrl: 'https://placehold.co/300x300/e64c81/FFFFFF?text=Costume',
      tags: ['세트', '스트레치', '사이즈조절'],
      isNew: true,
    },
  ];

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');

  // 검색어와 필터에 따라 제품 필터링
  useEffect(() => {
    setIsLoading(true);

    // API 요청 지연 시뮬레이션
    setTimeout(() => {
      let result = [...allProducts];

      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.tags.some((tag) => tag.toLowerCase().includes(query)),
        );
      }

      // 카테고리 필터
      if (selectedCategory) {
        result = result.filter((product) => product.category === selectedCategory);
      }

      // 서브카테고리 필터
      if (selectedSubcategory) {
        result = result.filter((product) => product.subcategory === selectedSubcategory);
      }

      // 제품 정렬
      switch (sortOption) {
        case 'price-low-high':
          result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-high-low':
          result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'bestseller':
          result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        default:
          // '추천순' - 기본 정렬 사용
          break;
      }

      setFilteredProducts(result);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, selectedCategory, selectedSubcategory, sortOption]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {selectedSubcategory ||
          (selectedCategory && categories.find((c) => c.id === selectedCategory)?.name) ||
          '성인용품 검색'}
      </h1>

      {/* 검색바 */}
      <div className="mb-6">
        <div className="flex gap-2 max-w-xl">
          <input
            type="text"
            placeholder="제품명, 태그, 키워드 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
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
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
          }}
          className={`px-4 py-2 rounded-full text-sm ${
            !selectedCategory
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedSubcategory(null);
            }}
            className={`px-4 py-2 rounded-full text-sm ${
              category.id === selectedCategory
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 서브카테고리 필터 (선택된 카테고리가 있을 때만 표시) */}
      {selectedCategory && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories
            .find((c) => c.id === selectedCategory)
            ?.subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  subcat === selectedSubcategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {subcat}
              </button>
            ))}
        </div>
      )}

      {/* 검색 결과 요약 및 정렬 */}
      <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {filteredProducts.length}개 제품 찾음
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 text-sm rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="recommended">추천순</option>
          <option value="price-low-high">가격 낮은순</option>
          <option value="price-high-low">가격 높은순</option>
          <option value="rating">평점순</option>
          <option value="newest">신상품순</option>
          <option value="bestseller">베스트셀러</option>
        </select>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />

                {/* 제품 배지 */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      신상품
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      베스트셀러
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {product.subcategory}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400">
                  {product.name}
                </h3>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    {product.discountPrice ? (
                      <div>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          {product.discountPrice.toLocaleString()}원
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm line-through ml-1">
                          {product.price.toLocaleString()}원
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                  </div>

                  <div className="text-yellow-500 text-sm flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                >
                  상세정보
                </Link>
              </div>
            </div>
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
          <p className="text-gray-600 dark:text-gray-400 mb-2">검색 결과가 없습니다.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedSubcategory(null);
              setSortOption('recommended');
            }}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* 페이지네이션 */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <button className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 transition-colors">
              이전
            </button>
            <button className="bg-purple-600 text-white px-3 py-2 rounded">1</button>
            <button className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 transition-colors">
              2
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 transition-colors">
              3
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 transition-colors">
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdultProductList;
