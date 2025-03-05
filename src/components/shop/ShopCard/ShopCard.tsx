import { JSX } from 'react';
import { Shop } from '../../../types/shop.types';

interface ShopCardProps {
  shop: Shop;
}

function ShopCard({ shop }: ShopCardProps): JSX.Element {
  return (
    <div className="shop-card">
      <h3>{shop.name}</h3>
      <p>{shop.description}</p>
    </div>
  );
}

export default ShopCard;
