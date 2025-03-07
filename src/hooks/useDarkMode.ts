import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setDarkMode, toggleDarkMode } from '../store/slices/uiSlice.ts';
import { useEffect } from 'react';

export const useDarkMode = () => {
  const dispatch = useDispatch();
  // useSelector 훅을 사용하여 isDarkMode 상태를 가져옴
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  // 테마 토글 함수
  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  // 초기 테마 설정 (로컬 스토리지 또는 시스템 설정  -> 리액트 hook)
  useEffect(() => {
    // 로컬 스토리지에서 테마 설정 확인
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme == 'dark') {
      dispatch(setDarkMode(true));
    } else if (savedTheme == 'light') {
      dispatch(setDarkMode(false));
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // 시스템 설정 기준으로 테마 설정
      dispatch(setDarkMode(true));
    }
  }, [dispatch]);

  // 테마 변경 시 로컬 스토리지에 저장 및 HTML 클래스 업데이트
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 사용자가 직접 테마를 설정한 경우(로컬 스토리지에 있는 경우)는 무시
      if (!localStorage.getItem('theme')) {
        dispatch(setDarkMode(e.matches));
      }
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return { isDarkMode, toggleTheme };
};
