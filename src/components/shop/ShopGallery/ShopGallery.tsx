import React, { useState } from 'react';
import { ShopImage } from '../../../types/shop.types';

interface ShopGalleryProps {
  images: ShopImage[];
}

const ShopGallery: React.FC<ShopGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sort images by sort order and prioritize featured images
  const sortedImages = [...images].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  const openModal = (index: number) => {
    setActiveImage(index);
    setShowModal(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">이미지가 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {/* Main image */}
        <div
          className="col-span-4 md:col-span-2 h-64 cursor-pointer rounded-lg overflow-hidden"
          onClick={() => openModal(0)}
        >
          <img
            src={sortedImages[0]?.url}
            alt={sortedImages[0]?.alt || sortedImages[0]?.type}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
        </div>

        {/* Grid of smaller images */}
        {sortedImages.slice(1, 5).map((image, index) => (
          <div
            key={image.id}
            className="hidden md:block h-32 cursor-pointer rounded-lg overflow-hidden"
            onClick={() => openModal(index + 1)}
          >
            <img
              src={image.url}
              alt={image.alt || image.type}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>
        ))}
      </div>

      {/* Image counter for small displays */}
      <div className="md:hidden mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        {sortedImages.length} 사진 보기
      </div>

      {/* Image modal/lightbox */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center p-4">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setShowModal(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative w-full max-w-4xl">
            <img
              src={sortedImages[activeImage]?.url}
              alt={sortedImages[activeImage]?.alt || sortedImages[activeImage]?.type}
              className="w-full max-h-[80vh] object-contain"
            />

            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-r-lg text-white hover:bg-opacity-70"
              onClick={handlePrevImage}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-l-lg text-white hover:bg-opacity-70"
              onClick={handleNextImage}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Thumbnails/counter */}
          <div className="mt-4 text-white">
            {activeImage + 1} / {sortedImages.length}
          </div>

          {/* Thumbnail strip */}
          <div className="mt-4 flex space-x-2 overflow-x-auto max-w-full pb-2">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`w-16 h-16 flex-shrink-0 cursor-pointer ${activeImage === index ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || image.type}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopGallery;
