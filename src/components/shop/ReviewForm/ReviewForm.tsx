import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '../../../components/ui/Button/Button';
import { Review } from '../../../types/shop.types';

type ReviewFormData = Omit<
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
>;

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
}

function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    content: '',
    images: [],
    nickname: '', // Added to match expected type
    likes: 0, // Added to match expected type
    dislikes: 0, // Added to match expected type
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 별점 선택 핸들러
  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 5개까지만 허용
    if (imageFiles.length + files.length > 5) {
      setError('이미지는 최대 5개까지 업로드 가능합니다.');
      return;
    }

    setError(null);
    const fileArray = Array.from(files);
    setImageFiles((prev) => [...prev, ...fileArray]);

    // 이미지 URL 생성 (실제 서비스에서는 서버에 업로드 후 URL을 받아야 함)
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...imageUrls],
    }));
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (index: number) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (formData.rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // 폼 초기화
      setFormData({
        rating: 0,
        title: '',
        content: '',
        images: [],
        nickname: '',
        likes: 0,
        dislikes: 0,
      });
      setImageFiles([]);
    } catch (err) {
      console.error('리뷰 제출 오류:', err);
      setError('리뷰 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 별점 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          별점
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="text-2xl focus:outline-none"
            >
              <span className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 self-center">
            {formData.rating > 0 ? `${formData.rating}점` : '별점을 선택하세요'}
          </span>
        </div>
      </div>

      {/* 제목 입력 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          제목 (선택사항)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          placeholder="리뷰 제목을 입력하세요"
        />
      </div>

      {/* 내용 입력 */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          리뷰 내용
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          placeholder="상품이나 서비스는 어땠나요? 솔직한 경험을 공유해주세요."
          required
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          사진 추가 (최대 5개)
        </label>
        <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="images"
                className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
              >
                <span>사진 업로드하기</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={imageFiles.length >= 5}
                />
              </label>
              <p className="pl-1">또는 드래그 앤 드롭</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
          </div>
        </div>

        {/* 업로드된 이미지 미리보기 */}
        {formData.images && formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? '제출 중...' : '리뷰 등록하기'}
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
