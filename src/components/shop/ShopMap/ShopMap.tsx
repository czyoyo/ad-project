import { useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface ShopMapProps {
  location: Location;
  address: string;
  shopName: string;
}

function ShopMap({ location, address, shopName }: ShopMapProps) {
  useEffect(() => {
    console.log(location, address, shopName);
  }, [location, address, shopName]);

  return <div></div>;
}

export default ShopMap;
