import { ReactNode, JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PublicRouteProps {
  children: ReactNode;
  restrictedWhenAuthenticated?: boolean;
}

/**
 * 공개 라우트 컴포넌트
 * 인증되지 않은 사용자가 접근할 수 있는 라우트를 정의합니다.
 *
 * @param children 렌더링할 컴포넌트
 * @param restrictedWhenAuthenticated 인증된 사용자의 접근을 제한할지 여부 (로그인/회원가입 페이지 등)
 */
function PublicRoute({
  children,
  restrictedWhenAuthenticated = true,
}: PublicRouteProps): JSX.Element {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  // 인증 초기화 중인 경우 로딩 표시
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // 인증된 사용자가 제한된 페이지에 접근하려는 경우 홈으로 리디렉션
  if (isAuthenticated && restrictedWhenAuthenticated) {
    // 이전 페이지 정보가 있는 경우 해당 페이지로 리디렉션
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // 제한이 없거나 인증되지 않은 경우 정상적으로 컴포넌트 표시
  return <>{children}</>;
}

export default PublicRoute;
