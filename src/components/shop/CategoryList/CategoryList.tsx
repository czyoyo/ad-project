import { JSX } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string; // 이미지 URL
}

interface CategoryListProps {
  categories?: Category[]; // 카테고리 데이터를 명시적으로 전달 가능
  limit?: number; // 보여줄 카테고리 개수 제한
}

// 성인용품 카테고리 더미 데이터
const adultShopCategories: Category[] = [
  {
    id: 1,
    name: '오프라인 매장',
    slug: 'offline',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=Offline+Shops',
  },
  {
    id: 2,
    name: '온라인 스토어',
    slug: 'online',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=Online+Stores',
  },
  {
    id: 3,
    name: '백화점 매장',
    slug: 'department',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=Department+Stores',
  },
  {
    id: 4,
    name: '24시간 매장',
    slug: '24hours',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=24H+Shops',
  },
  {
    id: 5,
    name: '수입제품 전문',
    slug: 'imported',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=Import+Shops',
  },
  {
    id: 6,
    name: '대형 매장',
    slug: 'large',
    image: 'https://placehold.co/300x200/e64c81/FFFFFF?text=Large+Shops',
  },
];

function CategoryList({
  categories = adultShopCategories,
  limit = 6,
}: CategoryListProps): JSX.Element {
  const displayedCategories = categories.slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayedCategories.map((category) => (
        <Link
          to={`/shops/${category.slug}`}
          key={category.id}
          className="block text-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
        >
          {category.image && (
            <div className="relative">
              <img src={category.image} alt={category.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}
          <div className="p-3">
            <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoryList;
