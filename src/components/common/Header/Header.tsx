import { useState, useEffect, JSX } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
// import { logout } from '../../../store/slices/authSlice';
import { useDarkMode } from '../../../hooks';
import Logo from '../Logo/Logo';
import Button from '../../ui/Button/Button';
import SearchBar from '../SearchBar/SearchBar';
/**
 * 헤더 컴포넌트
 * 네비게이션, 로고, 검색, 사용자 메뉴 등을 포함
 */
function Header(): JSX.Element {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useDarkMode();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃 핸들러
  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/');
  //   setIsUserMenuOpen(false);
  // };

  // 네비게이션 링크 활성화 여부
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white dark:bg-gray-800 shadow-md'
          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                성인용품점 추천
              </span>
            </Link>
          </div>
          <div className="p-4 bg-white dark:bg-purple-950 text-black dark:text-white">
            이 텍스트는 다크모드에서 색상이 변경됩니다.
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActiveLink('/')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              } transition-colors duration-200 font-medium`}
            >
              홈
            </Link>
            <Link
              to="/categories"
              className={`${
                isActiveLink('/categories')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              } transition-colors duration-200 font-medium`}
            >
              카테고리
            </Link>
            <Link
              to="/search"
              className={`${
                isActiveLink('/search')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              } transition-colors duration-200 font-medium`}
            >
              검색
            </Link>
            <Link
              to="/about"
              className={`${
                isActiveLink('/about')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              } transition-colors duration-200 font-medium`}
            >
              소개
            </Link>
          </nav>

          {/* 사용자 메뉴, 검색, 테마 토글 */}
          <div className="flex items-center space-x-4">
            {/* 검색 (작은 화면에서는 숨김) */}
            <div className="hidden lg:flex">
              <SearchBar />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
            {/* 인증 상태에 따른 사용자 메뉴 */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
                >
                  <span className="mr-2 hidden sm:inline-block">{user?.nickname}</span>
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {user?.nickname ? user.nickname.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                {/* 사용자 드롭다운 메뉴 */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      프로필
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      즐겨찾기
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" onClick={() => navigate('/login')}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
