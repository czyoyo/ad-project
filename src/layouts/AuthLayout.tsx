import { JSX } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ToastContainer from '../components/ui/Toast/ToastContainer';
import Logo from '../components/common/Logo/Logo';

/**
 * 인증 관련 페이지를 위한 레이아웃 컴포넌트
 * 로그인, 회원가입, 비밀번호 재설정 등의 페이지에 사용됨
 */
function AuthLayout(): JSX.Element {
  const { isPageLoading } = useSelector((state: RootState) => state.ui);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 간소화된 헤더 */}
      <header className="py-4 px-6 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>
      </header>

      {/* 인증 콘텐츠 */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isPageLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* 간소화된 푸터 */}
      <footer className="py-4 px-6 bg-white dark:bg-gray-800 shadow-inner">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 성인용품점 추천 서비스. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-gray-700 dark:hover:text-gray-300">
              개인정보처리방침
            </Link>
            <span>|</span>
            <Link to="/terms-of-service" className="hover:text-gray-700 dark:hover:text-gray-300">
              이용약관
            </Link>
          </div>
        </div>
      </footer>

      {/* 토스트 메시지 */}
      <ToastContainer />
    </div>
  );
}

export default AuthLayout;
