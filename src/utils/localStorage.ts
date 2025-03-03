/**
 * 로컬 스토리지 관련 유틸리티 함수
 */

// 토큰 저장 키
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';
const THEME_KEY = 'theme';
const FAVORITES_KEY = 'favorites';
const SEARCH_HISTORY_KEY = 'search_history';
const FILTER_PREFERENCES_KEY = 'filter_preferences';

/**
 * 토큰 관련 유틸리티
 */
export const authStorage = {
  // 토큰 저장
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 토큰 제거
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 리프레시 토큰 저장
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // 리프레시 토큰 가져오기
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // 리프레시 토큰 제거
  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 모든 인증 정보 제거
  clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  },
};

/**
 * 사용자 정보 관련 유틸리티
 */
export const userStorage = {
  // 사용자 정보 저장
  setUserInfo(userInfo: any): void {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  // 사용자 정보 가져오기
  getUserInfo<T = any>(): T | null {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo) as T;
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
      return null;
    }
  },

  // 사용자 정보 제거
  removeUserInfo(): void {
    localStorage.removeItem(USER_INFO_KEY);
  },
};

/**
 * 검색 기록 관련 유틸리티
 */
export const searchStorage = {
  // 최대 검색 기록 수
  MAX_HISTORY_ITEMS: 10,

  // 검색어 저장
  addSearchTerm(term: string): void {
    const history = this.getSearchHistory();
    // 중복 제거
    const filteredHistory = history.filter((item) => item !== term);
    // 최신 검색어를 맨 앞에 추가
    const newHistory = [term, ...filteredHistory].slice(0, this.MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  },

  // 검색 기록 가져오기
  getSearchHistory(): string[] {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return [];
    try {
      return JSON.parse(history) as string[];
    } catch (error) {
      console.error('Error parsing search history from localStorage:', error);
      return [];
    }
  },

  // 검색어 삭제
  removeSearchTerm(term: string): void {
    const history = this.getSearchHistory();
    const newHistory = history.filter((item) => item !== term);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  },

  // 검색 기록 전체 삭제
  clearSearchHistory(): void {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  },
};

/**
 * 즐겨찾기 관련 유틸리티
 */
export const favoritesStorage = {
  // 즐겨찾기 목록 가져오기
  getFavorites(): string[] {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (!favorites) return [];
    try {
      return JSON.parse(favorites) as string[];
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
      return [];
    }
  },

  // 즐겨찾기 저장
  setFavorites(favorites: string[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },

  // 즐겨찾기 추가
  addFavorite(shopId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(shopId)) {
      this.setFavorites([...favorites, shopId]);
    }
  },

  // 즐겨찾기 제거
  removeFavorite(shopId: string): void {
    const favorites = this.getFavorites();
    this.setFavorites(favorites.filter((id) => id !== shopId));
  },

  // 즐겨찾기 여부 확인
  isFavorite(shopId: string): boolean {
    return this.getFavorites().includes(shopId);
  },

  // 즐겨찾기 목록 초기화
  clearFavorites(): void {
    localStorage.removeItem(FAVORITES_KEY);
  },
};

/**
 * 테마 설정 관련 유틸리티
 */
export const themeStorage = {
  // 테마 가져오기
  getTheme(): 'light' | 'dark' | 'system' {
    const theme = localStorage.getItem(THEME_KEY);
    if (!theme) return 'system';
    return theme as 'light' | 'dark' | 'system';
  },

  // 테마 설정
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(THEME_KEY, theme);
  },
};

/**
 * 필터 설정 관련 유틸리티
 */
export const filterStorage = {
  // 필터 설정 저장
  setFilterPreferences(preferences: any): void {
    localStorage.setItem(FILTER_PREFERENCES_KEY, JSON.stringify(preferences));
  },

  // 필터 설정 가져오기
  getFilterPreferences<T = any>(): T | null {
    const preferences = localStorage.getItem(FILTER_PREFERENCES_KEY);
    if (!preferences) return null;
    try {
      return JSON.parse(preferences) as T;
    } catch (error) {
      console.error('Error parsing filter preferences from localStorage:', error);
      return null;
    }
  },

  // 필터 설정 초기화
  clearFilterPreferences(): void {
    localStorage.removeItem(FILTER_PREFERENCES_KEY);
  },
};

/**
 * 데이터 만료 관리 유틸리티
 */
export const expiryStorage = {
  // 만료 시간과 함께 데이터 저장
  setWithExpiry(key: string, value: any, ttl: number): void {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // 만료 시간을 확인하며 데이터 가져오기
  getWithExpiry<T = any>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      // 만료된 경우 항목 삭제 후 null 반환
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value as T;
    } catch (error) {
      console.error(`Error retrieving item ${key} from localStorage:`, error);
      return null;
    }
  },
};

export default {
  authStorage,
  userStorage,
  searchStorage,
  favoritesStorage,
  themeStorage,
  filterStorage,
  expiryStorage,
};
