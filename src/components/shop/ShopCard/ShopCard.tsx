import React from 'react';
import { Shop } from '../../../types/shop.types';

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="shop-card">
      <h3>{shop.name}</h3>
      <p>{shop.description}</p>
    </div>
  );
};

export default ShopCard;
