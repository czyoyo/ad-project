import { useState, useEffect, useCallback } from 'react';
import GeolocationService, {
  GeolocationPosition,
  GeolocationError,
} from '../services/geolocation.service';

/**
 * 위치 정보를 관리하는 커스텀 훅
 *
 * 사용자의 현재 위치 정보를 가져오고 관리하는 기능을 제공합니다.
 *
 * @param options 위치 정보 옵션 (선택적)
 * @returns 위치 정보, 상태, 위치 정보 가져오기 함수
 */
function useGeolocation(options?: {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  automaticFetch?: boolean;
}) {
  // 옵션 기본값 설정
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    automaticFetch = false,
  } = options || {};

  // 위치 정보 상태
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  // 에러 상태
  const [error, setError] = useState<GeolocationError | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(false);

  // 위치 정보 가져오기 함수
  const getLocation = useCallback(async () => {
    // 브라우저에서 위치 정보 API를 지원하는지 확인
    if (!GeolocationService.isGeolocationAvailable()) {
      setError({
        code: -1,
        message: '이 브라우저에서는 위치 정보 기능을 지원하지 않습니다.',
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 위치 정보 서비스에서 현재 위치 가져오기
      const position = await GeolocationService.getCurrentPosition({
        enableHighAccuracy,
        timeout,
        maximumAge,
      });

      setLocation(position);
      setLoading(false);
    } catch (err) {
      console.error('위치 정보 가져오기 오류:', err);

      setError(err as GeolocationError);
      setLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge]);

  // 자동으로 위치 정보 가져오기 (옵션에 따라)
  useEffect(() => {
    if (automaticFetch) {
      getLocation();
    }
  }, [automaticFetch, getLocation]);

  return {
    location,
    error,
    loading,
    getLocation,
  };
}

export default useGeolocation;
