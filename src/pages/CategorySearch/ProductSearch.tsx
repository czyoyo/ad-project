import { useState, useEffect } from 'react';

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

const ProductSearch = () => {
  // 샘플 데이터 - 실제로는 API 호출 등으로 대체할 수 있음
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
      imageUrl: '/placeholder-product.jpg',
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
      imageUrl: '/placeholder-product.jpg',
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
      imageUrl: '/placeholder-product.jpg',
      tags: ['천연', '무향', '보습'],
    },
    {
      id: 4,
      name: '고급 가죽 수갑',
      category: 'bondage',
      subcategory: '수갑',
      price: 45000,
      rating: 4.6,
      imageUrl: '/placeholder-product.jpg',
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
      imageUrl: '/placeholder-product.jpg',
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
      imageUrl: '/placeholder-product.jpg',
      tags: ['세트', '스트레치', '사이즈조절'],
      isNew: true,
    },
  ];

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOption, setSortOption] = useState('recommended');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 검색어와 필터에 따라 제품 필터링
  useEffect(() => {
    let result = [...allProducts];

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      );

      // 활성 필터에 검색어 추가
      if (!activeFilters.includes(`검색: ${searchQuery}`) && searchQuery !== '') {
        setActiveFilters((prev) => [...prev, `검색: ${searchQuery}`]);
      } else if (searchQuery === '') {
        setActiveFilters((prev) => prev.filter((f) => !f.startsWith('검색:')));
      }
    }

    // 카테고리 필터
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);

      // 활성 필터에 카테고리 추가
      const categoryName =
        categories.find((c) => c.id === selectedCategory)?.name || selectedCategory;
      if (!activeFilters.includes(`카테고리: ${categoryName}`)) {
        setActiveFilters((prev) => [
          ...prev.filter((f) => !f.startsWith('카테고리:')),
          `카테고리: ${categoryName}`,
        ]);
      }
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith('카테고리:')));
    }

    // 서브카테고리 필터
    if (selectedSubcategory) {
      result = result.filter((product) => product.subcategory === selectedSubcategory);

      // 활성 필터에 서브카테고리 추가
      if (!activeFilters.includes(`서브카테고리: ${selectedSubcategory}`)) {
        setActiveFilters((prev) => [
          ...prev.filter((f) => !f.startsWith('서브카테고리:')),
          `서브카테고리: ${selectedSubcategory}`,
        ]);
      }
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith('서브카테고리:')));
    }

    // 가격 범위 필터
    result = result.filter((product) => {
      const effectivePrice = product.discountPrice || product.price;
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });

    // 활성 필터에 가격 범위 업데이트
    const priceFilterText = `가격: ${priceRange[0].toLocaleString()}원 - ${priceRange[1].toLocaleString()}원`;
    setActiveFilters((prev) => {
      const withoutPrice = prev.filter((f) => !f.startsWith('가격:'));
      return [...withoutPrice, priceFilterText];
    });

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
  }, [searchQuery, selectedCategory, selectedSubcategory, priceRange, sortOption]);

  // 모든 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setPriceRange([0, 100000]);
    setSortOption('recommended');
  };

  // 단일 필터 제거
  const removeFilter = (filter: string) => {
    if (filter.startsWith('검색:')) {
      setSearchQuery('');
    } else if (filter.startsWith('카테고리:')) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else if (filter.startsWith('서브카테고리:')) {
      setSelectedSubcategory(null);
    } else if (filter.startsWith('가격:')) {
      setPriceRange([0, 100000]);
    }
  };

  return (
    <div className="min-h-screen bg-primary-900">
      {/* 메인 컨텐츠 */}
      <div className="container mx-auto py-8 px-4">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">제품 카테고리 & 검색</h1>
          <p className="text-secondary-100">원하는 제품을 카테고리별로 살펴보거나 검색해보세요</p>
        </div>

        {/* 검색바 */}
        <div className="mb-8">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="제품명, 태그, 키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-primary-800 text-white border border-secondary-600 focus:outline-none focus:border-secondary-400"
            />
            <button className="bg-secondary-400 hover:bg-secondary-300 text-white px-5 py-3 rounded-lg flex items-center">
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

        {/* 활성 필터 */}
        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-secondary-100">활성 필터:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="bg-secondary-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="hover:text-secondary-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-secondary-300 hover:text-secondary-100 text-sm underline"
              >
                모두 지우기
              </button>
            </div>
          </div>
        )}

        {/* 모바일 필터 버튼 */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full bg-secondary-600 hover:bg-secondary-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            필터 {isMobileFilterOpen ? '닫기' : '열기'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 필터 사이드바 - 데스크탑에서는 항상 표시, 모바일에서는 조건부 표시 */}
          <div className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-primary-800 rounded-xl p-4 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-primary-700">
                필터
              </h2>

              {/* 카테고리 필터 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">카테고리</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedSubcategory(null);
                        }}
                        className={`w-full text-left px-2 py-1 rounded ${
                          selectedCategory === category.id
                            ? 'bg-secondary-500 text-white'
                            : 'text-secondary-100 hover:bg-primary-700'
                        }`}
                      >
                        {category.name}
                      </button>

                      {/* 선택된 카테고리의 서브카테고리 표시 */}
                      {selectedCategory === category.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((subcat) => (
                            <button
                              key={subcat}
                              onClick={() => setSelectedSubcategory(subcat)}
                              className={`w-full text-left px-2 py-1 rounded text-sm ${
                                selectedSubcategory === subcat
                                  ? 'bg-secondary-400 text-white'
                                  : 'text-secondary-200 hover:bg-primary-700'
                              }`}
                            >
                              {subcat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 가격대 필터 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">가격대</h3>
                <div className="px-2">
                  <div className="flex justify-between text-sm text-secondary-100 mb-2">
                    <span>{priceRange[0].toLocaleString()}원</span>
                    <span>{priceRange[1].toLocaleString()}원</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 정렬 옵션 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">정렬</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-2 rounded bg-primary-700 text-white border border-primary-600 focus:outline-none focus:border-secondary-400"
                >
                  <option value="recommended">추천순</option>
                  <option value="price-low-high">가격 낮은순</option>
                  <option value="price-high-low">가격 높은순</option>
                  <option value="rating">평점순</option>
                  <option value="newest">신상품순</option>
                  <option value="bestseller">베스트셀러</option>
                </select>
              </div>
            </div>
          </div>

          {/* 제품 그리드 */}
          <div className="lg:w-3/4">
            {/* 검색 결과 요약 */}
            <div className="mb-4 flex justify-between items-center">
              <div className="text-secondary-100">{filteredProducts.length}개 제품 찾음</div>
              <div className="hidden md:block">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 rounded bg-primary-800 text-white border border-primary-700 focus:outline-none focus:border-secondary-400"
                >
                  <option value="recommended">추천순</option>
                  <option value="price-low-high">가격 낮은순</option>
                  <option value="price-high-low">가격 높은순</option>
                  <option value="rating">평점순</option>
                  <option value="newest">신상품순</option>
                  <option value="bestseller">베스트셀러</option>
                </select>
              </div>
            </div>

            {/* 제품 목록 */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-primary-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      {/* 제품 이미지 - 실제 이미지가 없으므로 플레이스홀더 사용 */}
                      <div className="h-48 bg-primary-700 flex items-center justify-center">
                        <span className="text-secondary-300">상품 이미지</span>
                      </div>

                      {/* 제품 뱃지 */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-secondary-400 text-white text-xs px-2 py-1 rounded">
                            신상품
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-secondary-300 text-white text-xs px-2 py-1 rounded">
                            베스트셀러
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-secondary-300 mb-1">{product.subcategory}</div>
                      <h3 className="font-semibold text-white mb-2">{product.name}</h3>

                      <div className="flex justify-between items-end mb-3">
                        <div>
                          {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {product.discountPrice.toLocaleString()}원
                              </span>
                              <span className="text-secondary-300 text-sm line-through">
                                {product.price.toLocaleString()}원
                              </span>
                            </div>
                          ) : (
                            <span className="text-white font-semibold">
                              {product.price.toLocaleString()}원
                            </span>
                          )}
                        </div>

                        <div className="text-secondary-200 text-sm flex items-center">
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

                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.map((tag, i) => (
                          <span
                            key={`${product.id}-${i}`}
                            className="text-xs bg-primary-700 text-secondary-200 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button className="w-full mt-4 bg-secondary-500 hover:bg-secondary-400 text-white rounded-lg py-2 transition-colors">
                        상점으로 이동
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary-800 rounded-xl p-8 text-center">
                <div className="text-secondary-300 text-5xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">검색 결과가 없습니다</h3>
                <p className="text-secondary-100 mb-4">
                  다른 키워드로 검색하거나 필터를 조정해보세요.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-secondary-500 hover:bg-secondary-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            )}

            {/* 페이지네이션 (간단한 구현) */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="bg-primary-800 text-secondary-200 hover:bg-secondary-600 hover:text-white px-3 py-2 rounded transition-colors">
                    이전
                  </button>
                  <button className="bg-secondary-500 text-white px-3 py-2 rounded">1</button>
                  <button className="bg-primary-800 text-secondary-200 hover:bg-secondary-600 hover:text-white px-3 py-2 rounded transition-colors">
                    2
                  </button>
                  <button className="bg-primary-800 text-secondary-200 hover:bg-secondary-600 hover:text-white px-3 py-2 rounded transition-colors">
                    3
                  </button>
                  <span className="px-3 py-2 text-secondary-200">...</span>
                  <button className="bg-primary-800 text-secondary-200 hover:bg-secondary-600 hover:text-white px-3 py-2 rounded transition-colors">
                    다음
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
