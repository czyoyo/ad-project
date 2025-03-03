// src/pages/ShopDetail/ShopDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Shop, Review } from '../../types/shop.types';
import { RootState } from '../../store/store';
import { useFavorites, useGeolocation } from '../../hooks';
import ShopService from '../../services/shop.service';
import Button from '../../components/ui/Button/Button';
import ReviewList from '../../components/shop/ReviewList/ReviewList';
import ReviewForm from '../../components/shop/ReviewForm/ReviewForm';
import ShopFeaturesList from '../../components/shop/ShopFeaturesList/ShopFeaturesList';
import ShopGallery from '../../components/shop/ShopGallery/ShopGallery';
import ShopMap from '../../components/shop/ShopMap/ShopMap';
import ShopHours from '../../components/shop/ShopHours/ShopHours';
import { formatPhoneNumber, formatAddress } from '../../utils/formatting';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { location } = useGeolocation();

  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // 상점 상세 정보 가져오기
        const shopData = await ShopService.getShopById(id);
        setShop(shopData);

        // 리뷰 정보 가져오기
        const reviewsData = await ShopService.getShopReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching shop details:', error);
        dispatch({
          type: 'ui/showToast',
          payload: {
            type: 'error',
            message: '상점 정보를 불러오는데 실패했습니다.',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [id, dispatch]);

  // 리뷰 추가 핸들러
  const handleAddReview = async (
    reviewData: Omit<
      Review,
      | 'id'
      | 'shopId'
      | 'userId'
      | 'userName'
      | 'userImage'
      | 'createdAt'
      | 'updatedAt'
      | 'isVerifiedPurchase'
      | 'userReaction'
      | 'replies'
    >,
  ) => {
    if (!id || !isAuthenticated) return;

    try {
      const newReview = await ShopService.addReview(id, reviewData);
      setReviews([newReview, ...reviews]);
      setIsReviewFormOpen(false);

      dispatch({
        type: 'ui/showToast',
        payload: {
          type: 'success',
          message: '리뷰가 성공적으로 등록되었습니다.',
        },
      });
    } catch (error) {
      console.error('Error adding review:', error);
      dispatch({
        type: 'ui/showToast',
        payload: {
          type: 'error',
          message: '리뷰 등록에 실패했습니다.',
        },
      });
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 즐겨찾기 토글 핸들러
  const handleFavoriteToggle = () => {
    if (!id || !shop) return;

    toggleFavorite(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          상점을 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          요청하신 상점 정보를 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.
        </p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          이전 페이지로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 상점 헤더 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          {/* 상단 정보 (이름, 평점, 즐겨찾기 등) */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {shop.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {shop.rating.toFixed(1)}
                  </span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">리뷰 {shop.reviewCount}개</span>
                <span className="mx-2 text-gray-400">•</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    shop.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {shop.status === 'active' ? '영업중' : '영업종료'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {shop.categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/categories/${category}`}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              {shop.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {shop.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorite(shop.id) ? 'text-red-500 border-red-500' : ''}
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill={isFavorite(shop.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isFavorite(shop.id) ? '저장됨' : '저장하기'}
              </Button>
              <Button variant="primary" size="sm">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                공유하기
              </Button>
            </div>
          </div>

          {/* 갤러리 */}
          <div className="mt-6">
            <ShopGallery images={shop.images} />
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            기본 정보
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            리뷰 ({shop.reviewCount})
          </button>
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'info' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 기본 정보 */}
            <div className="md:col-span-2 space-y-8">
              {/* 설명 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  상세 정보
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{shop.description}</p>
              </section>

              {/* 특징 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  매장 특징
                </h2>
                <ShopFeaturesList features={shop.features} />
              </section>
            </div>

            {/* 사이드바 정보 */}
            <div className="space-y-6">
              {/* 지도 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <ShopMap
                  location={shop.location}
                  address={shop.address.formattedAddress}
                  shopName={shop.name}
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">위치</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {formatAddress(shop.address.formattedAddress)}
                  </p>
                  {location && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      현재 위치에서{' '}
                      {shop.distance ? `약 ${shop.distance.toFixed(1)}km` : '거리 정보 없음'}
                    </p>
                  )}
                </div>
              </div>

              {/* 영업 시간 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">영업 시간</h3>
                <ShopHours hours={shop.businessHours} />
              </div>

              {/* 연락처 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">연락처</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                  {shop.contactInfo.phone && (
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a href={`tel:${shop.contactInfo.phone}`} className="hover:text-purple-600">
                        {formatPhoneNumber(shop.contactInfo.phone)}
                      </a>
                    </li>
                  )}
                  {shop.contactInfo.email && (
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`mailto:${shop.contactInfo.email}`}
                        className="hover:text-purple-600"
                      >
                        {shop.contactInfo.email}
                      </a>
                    </li>
                  )}
                  {shop.contactInfo.website && (
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      <a
                        href={shop.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600"
                      >
                        웹사이트 방문하기
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* 가격대 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">가격대</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <span
                      key={level}
                      className={`text-lg ${level <= shop.priceRange ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}
                    >
                      $
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 리뷰 작성 버튼 */}
            {isAuthenticated ? (
              <div className="flex justify-end">
                <Button variant="primary" onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}>
                  {isReviewFormOpen ? '취소' : '리뷰 작성하기'}
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  리뷰를 작성하려면 로그인이 필요합니다.
                </p>
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    로그인하기
                  </Button>
                </Link>
              </div>
            )}

            {/* 리뷰 작성 폼 */}
            {isReviewFormOpen && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  리뷰 작성
                </h3>
                <ReviewForm onSubmit={handleAddReview} />
              </div>
            )}

            {/* 리뷰 목록 */}
            {reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
