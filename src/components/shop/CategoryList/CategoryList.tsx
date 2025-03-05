import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  image?: string; // 이미지 URL
}

interface CategoryListProps {
  categories?: Category[]; // 카테고리 데이터를 명시적으로 전달 가능
  limit?: number; // 보여줄 카테고리 개수 제한
}

const dummyCategories: Category[] = [
  { id: 1, name: '플레이', image: '/images/categories/play.jpg' },
  { id: 2, name: '의류', image: '/images/categories/clothing.jpg' },
  { id: 3, name: '수집품', image: '/images/categories/collection.jpg' },
  { id: 4, name: '전자기기', image: '/images/categories/electronics.jpg' },
  { id: 5, name: '책/미디어', image: '/images/categories/books.jpg' },
  { id: 6, name: '기타', image: '/images/categories/etc.jpg' },
];

const CategoryList: React.FC<CategoryListProps> = ({ categories = dummyCategories, limit = 6 }) => {
  const displayedCategories = categories.slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayedCategories.map((category) => (
        <Link
          to={`/categories/${category.id}`}
          key={category.id}
          className="block text-center border rounded-lg p-4 hover:shadow-lg"
        >
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
          )}
          <span className="font-semibold text-gray-800">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
