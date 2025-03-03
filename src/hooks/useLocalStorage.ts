import { useState, useEffect } from 'react';

/**
 * localStorage를 사용하여 상태를 관리하는 커스텀 훅
 *
 * 이 훅은 React 상태와 localStorage를 동기화하여 새로고침 후에도
 * 상태가 유지되도록 합니다.
 *
 * @param key localStorage에 저장할 키
 * @param initialValue 초기값
 * @returns [값, 값 설정 함수]
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // 초기값 설정 함수
  const initialize = (): T => {
    try {
      // localStorage에서 값 가져오기
      const item = localStorage.getItem(key);

      // 값이 있으면 파싱하여 반환, 없으면 초기값 반환
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 에러 발생 시 초기값 반환
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(initialize);

  // 상태 업데이트 함수
  const setValue = (value: T | ((prevValue: T) => T)): void => {
    try {
      // 함수를 전달받을 경우 현재 상태를 기반으로 새 값 계산
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // 상태 업데이트
      setStoredValue(valueToStore);

      // localStorage에 저장
      localStorage.setItem(key, JSON.stringify(valueToStore));

      // 스토리지 변경 이벤트 발생
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore),
        }),
      );
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 다른 탭/창에서의 변경 감지
  useEffect(() => {
    // 스토리지 이벤트 핸들러
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          // 변경된 값으로 상태 업데이트
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value:`, error);
        }
      } else if (event.key === key && !event.newValue) {
        // 값이 삭제된 경우 초기값으로 설정
        setStoredValue(initialValue);
      }
    };

    // 스토리지 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
