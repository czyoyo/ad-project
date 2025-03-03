import { useState, useEffect } from 'react';

/**
 * 값의 변경을 지연시키는 디바운스 훅
 *
 * 입력값이 일정 시간 동안 변경되지 않았을 때만 값을 업데이트합니다.
 * 검색 입력, 필터링 등에서 API 호출 빈도를 줄이는 데 유용합니다.
 *
 * @param value 디바운스할 값
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  // 디바운스된 값 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지연 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 컴포넌트 업데이트 또는 언마운트 시 타이머 제거
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
