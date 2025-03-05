import React, { useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface ShopMapProps {
  location: Location;
  address: string;
  shopName: string;
}

const ShopMap: React.FC<ShopMapProps> = ({ location, address, shopName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Check if the Google Maps API is available
    if (window.google && window.google.maps && location && mapRef.current) {
      // Create a map instance if it doesn't exist yet
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 16,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });
      } else {
        // Update center if the map instance already exists
        mapInstanceRef.current.setCenter(location);
      }

      // Add marker for the shop
      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        title: shopName,
        animation: window.google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${shopName}</strong><p>${address}</p></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      // Open the info window by default
      infoWindow.open(mapInstanceRef.current, marker);
    } else {
      // Fallback for when Google Maps API is not available
      console.warn('Google Maps API is not loaded');
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        // No explicit cleanup required for Google Maps
        mapInstanceRef.current = null;
      }
    };
  }, [location, address, shopName]);

  // Provide a link to open in Google Maps
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${shopName} ${address}`,
    )}&ll=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="h-48 w-full bg-gray-200 dark:bg-gray-700"
        aria-label={`Map showing location of ${shopName}`}
      />
      <button
        onClick={openInGoogleMaps}
        className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-sm text-purple-600 dark:text-purple-400 py-1 px-2 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        길찾기
      </button>
    </div>
  );
};

export default ShopMap;
