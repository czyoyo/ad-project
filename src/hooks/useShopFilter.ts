import { useState } from 'react';
import { ShopFilter } from '../types/shop.types';

const useShopFilter = () => {
  const [filters, setFilters] = useState<Partial<ShopFilter>>({});

  const applyFilter = (newFilters: Partial<ShopFilter>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    filters,
    applyFilter,
    resetFilters,
  };
};

export default useShopFilter;
