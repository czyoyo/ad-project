import { useEffect, RefObject } from 'react';

/**
 * 지정된 요소 외부 클릭을 감지하는 커스텀 훅
 *
 * 주로 드롭다운 메뉴, 모달, 팝오버 등의 요소를 클릭 외부에서
 * 닫히도록 처리할 때 유용합니다.
 *
 * @param ref 감지할 요소의 ref
 * @param handler 외부 클릭 시 실행할 콜백 함수
 * @param excludeRefs 클릭 감지에서 제외할 요소들의 ref 배열 (선택적)
 */
function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  excludeRefs: RefObject<HTMLElement>[] = [],
): void {
  useEffect(() => {
    // 클릭 이벤트 핸들러
    const handleClickOutside = (event: MouseEvent): void => {
      // 클릭된 요소
      const target = event.target as Node;

      // 제외할 요소 확인
      const isExcluded = excludeRefs.some(
        (excludeRef) => excludeRef.current && excludeRef.current.contains(target),
      );

      // ref 요소가 클릭되지 않았고, 제외 요소도 클릭되지 않았을 때 핸들러 실행
      if (ref.current && !ref.current.contains(target) && !isExcluded) {
        handler();
      }
    };

    // 터치 이벤트 핸들러 (모바일 지원)
    const handleTouchOutside = (event: TouchEvent): void => {
      // 터치된 요소
      const target = event.targetTouches[0] ? (event.targetTouches[0].target as Node) : null;

      if (!target) return;

      // 제외할 요소 확인
      const isExcluded = excludeRefs.some(
        (excludeRef) => excludeRef.current && excludeRef.current.contains(target),
      );

      // ref 요소가 터치되지 않았고, 제외 요소도 터치되지 않았을 때 핸들러 실행
      if (ref.current && !ref.current.contains(target) && !isExcluded) {
        handler();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };

    // 의존성 배열: ref, handler, excludeRefs가 변경될 때만 이펙트 재실행
  }, [ref, handler, excludeRefs]);
}

export default useOutsideClick;
