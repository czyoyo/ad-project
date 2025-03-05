import { JSX, useState } from 'react';
import { Review } from '../../../types/shop.types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ReviewListProps {
  reviews: Review[];
}

function ReviewList({ reviews }: ReviewListProps): JSX.Element {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  // 리뷰 펼치기/접기 토글
  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId],
    );
  };

  // 리뷰 시간 포맷팅
  const formatReviewDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.includes(review.id);
        const hasLongContent = review.content.length > 200;
        const displayContent =
          hasLongContent && !isExpanded ? `${review.content.substring(0, 200)}...` : review.content;

        return (
          <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {/* 리뷰 헤더 - 사용자 정보 및 평점 */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={review.userImage || 'https://via.placeholder.com/40'}
                  alt={review.nickname || review.nickname || '사용자'}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {review.nickname || review.nickname || '익명 사용자'}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatReviewDate(review.createdAt)}
                    {review.isVerifiedPurchase && (
                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-medium">
                        구매 인증
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* 리뷰 제목 */}
            {review.title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {review.title}
              </h3>
            )}

            {/* 리뷰 내용 */}
            <div className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
              {displayContent}
              {hasLongContent && (
                <button
                  onClick={() => toggleReviewExpand(review.id)}
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {isExpanded ? '접기' : '더 보기'}
                </button>
              )}
            </div>

            {/* 리뷰 이미지 */}
            {review.images && review.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {review.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 리뷰 평가 및 댓글 수 */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>{review.likes}</span>
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2"
                    />
                  </svg>
                  <span>{review.dislikes}</span>
                </button>
              </div>
              {review.replies && review.replies.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  답변 {review.replies.length}개
                </span>
              )}
            </div>

            {/* 답변/리플라이 표시 (있을 경우) */}
            {review.replies && review.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                {review.replies.map((reply, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">
                          판매자
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reply.nickname || '판매자'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {formatReviewDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
