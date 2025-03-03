import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 테마 모드 타입 정의
type ThemeMode = 'light' | 'dark' | 'system';

// 테마 컨텍스트 인터페이스
interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// 기본값으로 초기화된 테마 컨텍스트
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
}) => {
  // 로컬 스토리지에서 테마 설정 읽기 또는 기본값 사용
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    return savedTheme || defaultTheme;
  });

  // 현재 다크 모드 여부
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  });

  // 테마 변경 시 로컬 스토리지에 저장 및 문서에 적용
  useEffect(() => {
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      updateDocumentTheme(isDark);
    } else {
      const isDark = theme === 'dark';
      setIsDarkMode(isDark);
      updateDocumentTheme(isDark);
    }
  }, [theme]);

  // 시스템 테마 변경 이벤트 리스너
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
        updateDocumentTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 테마를 토글하는 함수
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // 문서의 HTML 요소에 다크 모드 클래스 추가/제거
  const updateDocumentTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 테마 컨텍스트를 사용하기 위한 커스텀 훅
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
