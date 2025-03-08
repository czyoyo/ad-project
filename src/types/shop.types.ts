// 기본 상점정보 인터페이스
export interface Shop {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  status: ShopStatus;
  thumbnailUrl: string;
  images: ShopImage[];
  features: ShopFeatures;
  distance?: number; // Only used in search results
  priceRange: 1 | 2 | 3 | 4 | 5;
  businessHours: BusinessHours;
  tags: string[];
  owner?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  categories: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    formattedAddress: string;
  };

  location: {
    latitude: number;
    longitude: number;
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude] for GeoJSON
  };
  contactInfo: {
    // 연락처 정보
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      x?: string;
    };
  };
}

// 상점 운영 시간
export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  holidays: { [key: string]: DayHours | null }; // Special holiday hours
}

// 하루 운영 시간
export interface DayHours {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
}

// 상점 이미지
export interface ShopImage {
  id: string;
  url: string;
  alt?: string;
  isFeatured?: boolean;
  sortOrder: number;
  type: 'exterior' | 'interior' | 'food' | 'drink' | 'menu' | 'other' | 'product';
}

// 상점 특징/시설
export interface ShopFeatures {
  hasParking: boolean;
  isWheelchairAccessible: boolean;
  hasPrivateRooms: boolean;
  acceptsCreditCards: boolean;
  hasFittingRooms: boolean;
  offersCurbsidePickup: boolean;
  hasWifi: boolean;
  isLGBTQFriendly: boolean;
  isDiscreet: boolean;
  hasExperiencedStaff: boolean;
  offersConsultations: boolean;
  additionalFeatures: string[];
}

// 상점 상태
export enum ShopStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  TEMPORARILY_CLOSED = 'temporarily_closed',
  COMING_SOON = 'coming_soon',
  PERMANENTLY_CLOSED = 'permanently_closed',
}

// 상점 검색/필터 파라미터
export interface ShopFilter {
  category?: string;
  location?: string;
  distance?: number; // in km/miles
  latitude?: number;
  longitude?: number;
  features?: string[];
  priceRange?: number[];
  rating?: number;
  search?: string;
  sortBy?: 'distance' | 'rating' | 'reviewCount' | 'priceRange';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  isOpen?: boolean;
}
// 카테고리 인터페이스
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  parentId?: string;
  subcategories?: Category[];
  shopCount?: number;
  isActive: boolean;
  sortOrder: number;
}

// 리뷰 인터페이스
export interface Review {
  id: string;
  shopId: string;
  userId: string;
  nickname: string;
  userImage?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  isVerifiedPurchase: boolean;
  userReaction?: 'like' | 'dislike' | null;
  replies?: ReviewReply[];
}

// 리뷰 댓글
export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  nickname: string;
  userImage?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isShopOwner: boolean;
}

// 상점 즐겨찾기/저장 상태
export interface ShopSaveStatus {
  isSaved: boolean;
  savedAt?: string;
  listId?: string; // If saved to a custom list
}

// 사용자 저장 목록
export interface SavedList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  shops: string[]; // IDs of saved shops
  createdAt: string;
  updatedAt: string;
}
