import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Shop, ShopStatus } from '../../../types/shop.types';

interface ShopCardProps {
  shop: Shop;
}

function ShopCard({ shop }: ShopCardProps): JSX.Element {
  // 별점을 시각화하는 헬퍼 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // 꽉 찬 별
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    // 반 별
    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 0L7.102 5.534H1.175l4.642 3.366-1.774 5.464L10 11.464l4.957 2.9-1.774-5.464 4.642-3.366h-5.927L10 0z"
            clipRule="evenodd"
            fillOpacity="0.5"
          />
          <path
            fillRule="evenodd"
            d="M10 0v11.464l-4.957 2.9 1.774-5.464-4.642-3.366h5.927L10 0z"
            clipRule="evenodd"
          />
        </svg>,
      );
    }

    // 빈 별
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-300 dark:text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    return stars;
  };

  // 매장 상태에 따른 배지 및 색상
  const getStatusBadge = (status: ShopStatus) => {
    switch (status) {
      case ShopStatus.ACTIVE:
        return { text: '영업중', className: 'bg-green-600 text-white' };
      case ShopStatus.CLOSED:
        return { text: '영업 종료', className: 'bg-gray-600 text-white' };
      case ShopStatus.TEMPORARILY_CLOSED:
        return { text: '임시 휴업', className: 'bg-orange-600 text-white' };
      case ShopStatus.COMING_SOON:
        return { text: '오픈 예정', className: 'bg-blue-600 text-white' };
      case ShopStatus.PERMANENTLY_CLOSED:
        return { text: '폐업', className: 'bg-red-600 text-white' };
      default:
        return { text: '', className: '' };
    }
  };

  // 가격 범위를 $ 기호로 표시
  const renderPriceRange = (priceRange: number) => {
    return Array(priceRange).fill('$').join('');
  };

  // 거리 표시 포맷팅
  const formatDistance = (distance?: number) => {
    if (!distance) return null;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // 매장 카테고리 가져오기
  const getPrimaryCategory = () => {
    return shop.categories && shop.categories.length > 0 ? shop.categories[0] : null;
  };

  // 상점 특징/시설 배열로 변환
  const getFeaturesList = () => {
    const features = [];

    if (shop.features.hasParking) features.push('주차가능');
    if (shop.features.isWheelchairAccessible) features.push('휠체어 접근');
    if (shop.features.hasPrivateRooms) features.push('개인실');
    if (shop.features.acceptsCreditCards) features.push('카드결제');
    if (shop.features.hasFittingRooms) features.push('시착가능');
    if (shop.features.hasWifi) features.push('와이파이');
    if (shop.features.isLGBTQFriendly) features.push('LGBTQ 친화적');
    if (shop.features.isDiscreet) features.push('익명구매');
    if (shop.features.hasExperiencedStaff) features.push('전문 스태프');
    if (shop.features.offersConsultations) features.push('상담가능');

    // 추가 특징도 포함
    if (shop.features.additionalFeatures?.length) {
      features.push(...shop.features.additionalFeatures);
    }

    return features;
  };

  // 메인 이미지 URL 가져오기
  const getMainImageUrl = () => {
    // 대표 이미지 찾기
    const featuredImage = shop.images.find((img) => img.isFeatured);

    // 대표 이미지가 없으면 첫 번째 이미지, 없으면 썸네일, 없으면 기본 이미지
    return (
      featuredImage?.url ||
      (shop.images.length > 0 ? shop.images[0].url : shop.thumbnailUrl) ||
      'https://placehold.co/400x300/e64c81/FFFFFF?text=Shop'
    );
  };

  // Shop 스키마와 맞는 메인 특징들
  const mainFeatures = getFeaturesList().slice(0, 3); // 최대 3개까지만 표시
  const statusBadge = getStatusBadge(shop.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        {/* 매장 이미지 */}
        <img src={getMainImageUrl()} alt={shop.name} className="w-full h-48 object-cover" />

        {/* 카테고리 배지 */}
        {getPrimaryCategory() && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
              {getPrimaryCategory()}
            </span>
          </div>
        )}

        {/* 운영 상태 배지 */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded ${statusBadge.className}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* 인증 매장 배지 */}
        {shop.isVerified && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              인증 매장
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 매장명 및 평점 */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
          {shop.rating > 0 && (
            <div className="flex items-center">
              <div className="flex">{renderStars(shop.rating)}</div>
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                ({shop.rating.toFixed(1)})
              </span>
            </div>
          )}
        </div>

        {/* 가격대 및 리뷰 수 */}
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {renderPriceRange(shop.priceRange)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">리뷰 {shop.reviewCount}개</span>
        </div>

        {/* 주소 또는 설명 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {shop.address.formattedAddress || shop.description}
        </p>

        {/* 거리 정보 (있는 경우) */}
        {shop.distance && (
          <p className="text-xs text-green-600 dark:text-green-400 mb-2">
            현재 위치에서 {formatDistance(shop.distance)}
          </p>
        )}

        {/* 태그/특징 */}
        {mainFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {mainFeatures.map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
            {getFeaturesList().length > 3 && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                +{getFeaturesList().length - 3}
              </span>
            )}
          </div>
        )}

        {/* 링크 버튼 */}
        <Link
          to={`/shops/${shop.id}`}
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
}

export default ShopCard;
