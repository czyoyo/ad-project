import { useState, useEffect } from 'react';

/**
 * 화면 크기 기준점
 */
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * 반응형 디자인을 위한 화면 크기 감지 커스텀 훅
 *
 * 현재 화면 크기와 미디어 쿼리 상태에 따른 반응형 처리를 도와줍니다.
 *
 * @returns 화면 크기 정보와 미디어 쿼리 상태
 */
function useResponsive() {
  // 화면 크기 상태
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // 미디어 쿼리 상태
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    current: '' as keyof typeof breakpoints | '',
  });

  // 화면 크기 변경 감지
  useEffect(() => {
    // 서버 사이드 렌더링 환경에서는 실행하지 않음
    if (typeof window === 'undefined') return;

    // 화면 크기 변경 핸들러
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 현재 화면 크기 업데이트
      setWindowSize({ width, height });

      // 현재 브레이크포인트 결정
      let currentBreakpoint: keyof typeof breakpoints | '' = '';

      if (width < breakpoints.sm) {
        currentBreakpoint = 'xs';
      } else if (width < breakpoints.md) {
        currentBreakpoint = 'sm';
      } else if (width < breakpoints.lg) {
        currentBreakpoint = 'md';
      } else if (width < breakpoints.xl) {
        currentBreakpoint = 'lg';
      } else if (width < breakpoints['2xl']) {
        currentBreakpoint = 'xl';
      } else {
        currentBreakpoint = '2xl';
      }

      // 브레이크포인트 상태 업데이트
      setBreakpoint({
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeDesktop: width >= breakpoints.xl,
        current: currentBreakpoint,
      });
    };

    // 초기 화면 크기 설정
    handleResize();

    // 화면 크기 변경 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * 현재 화면 크기가 지정된 브레이크포인트보다 크거나 같은지 확인
   * @param point 확인할 브레이크포인트
   * @returns 해당 브레이크포인트보다 크거나 같으면 true
   */
  const isAbove = (point: keyof typeof breakpoints) => {
    return windowSize.width >= breakpoints[point];
  };

  /**
   * 현재 화면 크기가 지정된 브레이크포인트보다 작은지 확인
   * @param point 확인할 브레이크포인트
   * @returns 해당 브레이크포인트보다 작으면 true
   */
  const isBelow = (point: keyof typeof breakpoints) => {
    return windowSize.width < breakpoints[point];
  };

  /**
   * 현재 화면 크기가 두 브레이크포인트 사이인지 확인
   * @param min 최소 브레이크포인트
   * @param max 최대 브레이크포인트
   * @returns 두 브레이크포인트 사이이면 true
   */
  const isBetween = (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => {
    return windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];
  };

  // 화면 방향
  const orientation = windowSize.width > windowSize.height ? 'landscape' : 'portrait';

  return {
    width: windowSize.width,
    height: windowSize.height,
    ...breakpoint,
    breakpoints,
    isAbove,
    isBelow,
    isBetween,
    orientation,
  };
}

export default useResponsive;
