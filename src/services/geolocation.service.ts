// src/services/geolocation.service.ts

import env from '../config/environment';

/**
 * 위치 정보 관련 클래스
 * 위치 관련 이벤트와 옵션 인터페이스
 */
export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * 위치 정보 서비스
 * 사용자의 현재 위치를 가져오고 거리 계산 등의 기능을 제공합니다.
 */
class GeolocationService {
  /**
   * 브라우저 위치 정보 API가 사용 가능한지 확인
   */
  isGeolocationAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
  }

  /**
   * 현재 위치 가져오기
   * @param options 위치 정보 옵션
   */
  async getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    if (!this.isGeolocationAvailable()) {
      throw new Error('Geolocation API is not available in this browser.');
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10초
      maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
      ...options,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let errorMessage = 'Unknown error occurred while getting geolocation.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
          }

          reject({
            code: error.code,
            message: errorMessage,
          });
        },
        defaultOptions,
      );
    });
  }

  /**
   * 위치 변경 감지 시작
   * @param successCallback 성공 콜백
   * @param errorCallback 에러 콜백
   * @param options 위치 정보 옵션
   */
  watchPosition(
    successCallback: (position: GeolocationPosition) => void,
    errorCallback?: (error: GeolocationError) => void,
    options?: GeolocationOptions,
  ): number {
    if (!this.isGeolocationAvailable()) {
      if (errorCallback) {
        errorCallback({
          code: -1,
          message: 'Geolocation API is not available in this browser.',
        });
      }
      return -1;
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        successCallback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        if (errorCallback) {
          let errorMessage = 'Unknown error occurred while watching geolocation.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
          }

          errorCallback({
            code: error.code,
            message: errorMessage,
          });
        }
      },
      defaultOptions,
    );
  }

  /**
   * 위치 변경 감지 중지
   * @param watchId 감지 ID
   */
  clearWatch(watchId: number): void {
    if (this.isGeolocationAvailable() && watchId !== -1) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * 두 위치 간의 거리 계산 (Haversine 공식)
   * @param lat1 첫 번째 위치 위도
   * @param lon1 첫 번째 위치 경도
   * @param lat2 두 번째 위치 위도
   * @param lon2 두 번째 위치 경도
   * @returns 거리 (킬로미터)
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 지구 반경 (km)
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 킬로미터 단위 거리
    return Math.round(distance * 100) / 100; // 소수점 둘째 자리까지 반올림
  }

  /**
   * 도(degree)를 라디안(radian)으로 변환
   * @param degrees 각도 (도)
   * @returns 라디안 값
   */
  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * 기본 위치 반환 (사용자 위치를 가져올 수 없는 경우)
   * @returns 기본 위치 (서울시청 좌표)
   */
  getDefaultLocation(): GeolocationPosition {
    return {
      latitude: env.DEFAULT_LOCATION.latitude,
      longitude: env.DEFAULT_LOCATION.longitude,
    };
  }

  /**
   * 위치 문자열로 표시 (위도, 경도)
   * @param position 위치 정보
   * @returns 위치 문자열
   */
  formatLocationString(position: GeolocationPosition): string {
    return `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`;
  }

  /**
   * 주어진 위치 주변의 좌표 범위 계산
   * 특정 반경 내의 상점을 검색할 때 사용할 수 있는 위도/경도 범위를 계산합니다.
   *
   * @param latitude 중심 위도
   * @param longitude 중심 경도
   * @param radiusInKm 반경 (킬로미터)
   * @returns 좌표 범위 {minLat, maxLat, minLng, maxLng}
   */
  calculateBoundingBox(
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
    const R = 6371; // 지구 반경 (km)

    // 위도 1도당 거리 (km)
    const latKm = 111;

    // 위도에 따른 경도 1도당 거리 (km)
    const lngKm = 111 * Math.cos(this.degreesToRadians(latitude));

    // 위도 범위 계산
    const latChange = radiusInKm / latKm;
    const minLat = latitude - latChange;
    const maxLat = latitude + latChange;

    // 경도 범위 계산
    const lngChange = radiusInKm / lngKm;
    const minLng = longitude - lngChange;
    const maxLng = longitude + lngChange;

    return {
      minLat,
      maxLat,
      minLng,
      maxLng,
    };
  }

  /**
   * 좌표를 주소로 변환 (역지오코딩)
   * 참고: 이 기능은 실제 API를 호출해야 하므로 필요에 따라 구현해야 합니다.
   *
   * @param latitude 위도
   * @param longitude 경도
   * @returns 주소 문자열 (비동기)
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // 구현 예시: 실제로는 Google Maps Geocoding API 등을 사용해야 합니다.
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.GOOGLE_MAPS_API_KEY}`);
      // const data = await response.json();
      // return data.results[0]?.formatted_address || '주소를 찾을 수 없습니다.';

      // 테스트를 위한 가상 응답
      return `서울특별시 중구 세종대로 110 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return '주소 변환 중 오류가 발생했습니다.';
    }
  }

  /**
   * 주소를 좌표로 변환 (지오코딩)
   * 참고: 이 기능은 실제 API를 호출해야 하므로 필요에 따라 구현해야 합니다.
   *
   * @param address 주소 문자열
   * @returns 위도, 경도 좌표 (비동기)
   */
  async geocode(address: string): Promise<GeolocationPosition | null> {
    try {
      // 구현 예시: 실제로는 Google Maps Geocoding API 등을 사용해야 합니다.
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${env.GOOGLE_MAPS_API_KEY}`);
      // const data = await response.json();
      // const location = data.results[0]?.geometry?.location;
      // return location ? { latitude: location.lat, longitude: location.lng } : null;

      // 테스트를 위한 가상 응답 (서울시청 좌표 반환)
      return {
        latitude: 37.5665,
        longitude: 126.978,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
}

export default new GeolocationService();
