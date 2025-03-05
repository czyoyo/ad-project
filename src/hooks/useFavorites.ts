import { useState } from 'react';

const FAVORITES_KEY = 'favoriteShops';

export const useFavorites = () => {
  const [favoriteShops, setFavoriteShops] = useState<string[]>(() => {
    // 로컬 스토리지에서 즐겨찾기 데이터를 가져온다.
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // 즐겨찾기에 추가 여부 확인
  const isFavorite = (shopId: string): boolean => {
    return favoriteShops.includes(shopId);
  };

  // 즐겨찾기 토글 함수
  const toggleFavorite = (shopId: string): void => {
    let updatedFavorites: string[] = [];

    if (isFavorite(shopId)) {
      // 이미 즐겨찾기에 포함된 경우 제거
      updatedFavorites = favoriteShops.filter((id) => id !== shopId);
    } else {
      // 포함되지 않은 경우 추가
      updatedFavorites = [...favoriteShops, shopId];
    }

    // 상태 및 로컬 스토리지를 업데이트
    setFavoriteShops(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  return {
    favoriteShops,
    isFavorite,
    toggleFavorite,
  };
};

export default useFavorites;
