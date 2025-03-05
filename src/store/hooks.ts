import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store.ts';
import { ShopFilter } from '../types/shop.types';

/**
 * localStorage에 데이터를 저장하고 관리하는 훅
 * @param key 저장소 키
 * @param initialValue 초기값
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // 상태 초기화 함수
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // localStorage에 값 저장
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      // 함수 형태로 값 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * 쿼리 파라미터를 관리하는 훅
 */
export function useQueryParams<T extends Record<string, string>>() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // 현재 쿼리 파라미터를 객체로 변환
  const getParams = (): T => {
    const params: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
    return params as T;
  };

  // 쿼리 파라미터 설정
  const setParams = useCallback(
    (newParams: Partial<T>) => {
      const params = getParams();
      const updatedParams = { ...params, ...newParams };
      const searchParams = new URLSearchParams();

      // 빈 값은 제외
      Object.entries(updatedParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          searchParams.set(key, value);
        }
      });

      navigate({ search: searchParams.toString() }, { replace: true });
    },
    [navigate, location.search],
  );

  return { params: getParams(), setParams };
}

/**
 * 브라우저의 geolocation API를 사용하여 현재 위치를 가져오는 훅
 */
export function useGeolocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  return { location, error, loading, getLocation };
}

/**
 * 반응형 디자인을 위한 화면 크기 감지 훅
 */
export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoints, setBreakpoints] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setBreakpoints({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...windowSize, ...breakpoints };
}

/**
 * 무한 스크롤 구현을 위한 훅
 * @param callback 추가 데이터를 로드하는 콜백 함수
 * @param options 설정 옵션
 */
export function useInfiniteScroll(
  callback: () => void,
  { threshold = 100, enabled = true }: { threshold?: number; enabled?: boolean } = {},
) {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    if (!enabled || isFetching) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      setIsFetching(true);
    }
  }, [callback, isFetching, threshold, enabled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return { isFetching };
}

/**
 * 요소 외부 클릭 감지 훅
 * @param ref 대상 요소의 ref
 * @param callback 외부 클릭 시 실행할 콜백 함수
 */
export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T>, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * 디바운스 처리 훅
 * @param value 디바운스할 값
 * @param delay 지연 시간 (ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 스로틀 함수 생성 훅
 * @param callback 스로틀할 콜백 함수
 * @param delay 지연 시간 (ms)
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 200,
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecuted.current;

      if (elapsed >= delay) {
        lastExecuted.current = now;
        callback(...args);
      } else {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          lastExecuted.current = Date.now();
          callback(...args);
        }, delay - elapsed);
      }
    },
    [callback, delay],
  );
}

/**
 * 상점 필터 상태 관리 훅
 */
export function useShopFilter() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.shop.filters);
  const { params, setParams } = useQueryParams<{
    category?: string;
    location?: string;
    rating?: string;
    search?: string;
  }>();

  // URL 쿼리 파라미터와 상태 동기화
  useEffect(() => {
    if (
      params.category !== filters.category ||
      params.location !== filters.location ||
      params.rating !== String(filters.rating) ||
      params.search !== filters.search
    ) {
      dispatch({
        type: 'shop/setFilters',
        payload: {
          category: params.category || '',
          location: params.location || '',
          rating: params.rating ? parseInt(params.rating, 10) : 0,
          search: params.search || '',
        },
      });
    }
  }, [params, dispatch]);

  // 필터 적용 함수
  const applyFilter = useCallback(
    (newFilters: Partial<ShopFilter>) => {
      // 쿼리 파라미터 업데이트
      setParams({
        category: newFilters.category !== undefined ? newFilters.category : params.category,
        location: newFilters.location !== undefined ? newFilters.location : params.location,
        rating: newFilters.rating !== undefined ? String(newFilters.rating) : params.rating,
        search: newFilters.search !== undefined ? newFilters.search : params.search,
      });
    },
    [params, setParams],
  );

  // 필터 초기화 함수
  const resetFilters = useCallback(() => {
    setParams({
      category: '',
      location: '',
      rating: '',
      search: '',
    });
  }, [setParams]);

  return { filters, applyFilter, resetFilters };
}

/**
 * 이전 값을 저장하는 훅
 * @param value 현재 값
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * 다크 모드 관리 훅
 */
export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  });

  // 테마 변경 시 HTML 클래스 업데이트
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      setIsDarkMode(theme === 'dark');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 테마 토글 함수
  const toggleTheme = useCallback(() => {
    setTheme((prev: 'light' | 'dark' | 'system') => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, [setTheme]);

  // 특정 테마로 설정하는 함수
  const setSpecificTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  return {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme: setSpecificTheme,
  };
}

/**
 * 북마크/즐겨찾기 관리 훅
 */
export function useFavorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.shop.favorites);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 즐겨찾기 추가
  const addFavorite = useCallback(
    (shopId: string) => {
      if (!isAuthenticated) {
        // 로그인 필요 알림
        dispatch({
          type: 'ui/showToast',
          payload: {
            type: 'warning',
            message: '즐겨찾기 기능은 로그인 후 이용 가능합니다.',
          },
        });
        return;
      }

      dispatch({ type: 'shop/addFavorite', payload: shopId });
    },
    [dispatch, isAuthenticated],
  );

  // 즐겨찾기 제거
  const removeFavorite = useCallback(
    (shopId: string) => {
      dispatch({ type: 'shop/removeFavorite', payload: shopId });
    },
    [dispatch],
  );

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback(
    (shopId: string) => {
      return favorites.includes(shopId);
    },
    [favorites],
  );

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    (shopId: string) => {
      if (isFavorite(shopId)) {
        removeFavorite(shopId);
      } else {
        addFavorite(shopId);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}

/**
 * 인증 상태 관리 훅
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 로그인
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch({ type: 'auth/login/pending' });
        // API 호출 (Redux Thunk로 처리)
        await dispatch({ type: 'auth/login', payload: { email, password } });
        return true;
      } catch (_error) {
        return false;
      }
    },
    [dispatch],
  );

  // 로그아웃
  const logout = useCallback(() => {
    dispatch({ type: 'auth/logout' });
    navigate('/');
  }, [dispatch, navigate]);

  // 회원가입
  // 회원가입 데이터를 위한 구체적인 타입 정의 -> 이거 나중에 인터페이스 찾아서 대체해야함
  type RegisterUserData = {
    email: string;
    password: string;
    nickname: string;
    // 추가 필드를 위한 인덱스 시그니처
    [key: string]: string | number | boolean;
  };
  const register = useCallback(
    async (userData: RegisterUserData) => {
      try {
        dispatch({ type: 'auth/register/pending' });
        // API 호출 (Redux Thunk로 처리)
        await dispatch({ type: 'auth/register', payload: userData });
        return true;
      } catch (_error) {
        return false;
      }
    },
    [dispatch],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
  };
}

export default {
  useLocalStorage,
  useQueryParams,
  useGeolocation,
  useResponsive,
  useInfiniteScroll,
  useOutsideClick,
  useDebounce,
  useThrottle,
  useShopFilter,
  usePrevious,
  useDarkMode,
  useFavorites,
  useAuth,
};
