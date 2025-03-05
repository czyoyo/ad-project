import React from 'react';
import { ShopFilter } from '../../../types/shop.types';

interface SearchFiltersProps {
  currentFilters: ShopFilter;
  onApplyFilters: (filters: Partial<ShopFilter>) => void;
  onClose: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  currentFilters,
  onApplyFilters,
  onClose,
}) => {
  const [filters, setFilters] = React.useState<Partial<ShopFilter>>(currentFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          검색어
        </label>
        <input
          id="search"
          name="search"
          type="text"
          value={filters.search || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          카테고리
        </label>
        <select
          id="category"
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">전체</option>
          <option value="category1">카테고리1</option>
          <option value="category2">카테고리2</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
        >
          취소
        </button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md">
          적용
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
