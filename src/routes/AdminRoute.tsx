import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { JSX, ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * 관리자 라우트 컴포넌트
 * 관리자 권한이 있는 사용자만 접근할 수 있는 라우트를 정의합니다.
 */
function AdminRoute({ children }: AdminRouteProps): JSX.Element {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  const { isPageLoading } = useSelector((state: RootState) => state.ui);

  // 인증 또는 페이지 로딩 중인 경우 로딩 표시
  if (isLoading || isPageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⚠️ 여기에서 중요한 변경: user.role 필드 접근 방식을 확인하세요
  // 관리자 권한이 없는 경우 접근 거부 페이지로 리디렉션
  if (!user || user.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  // 관리자인 경우 정상적으로 컴포넌트 표시
  return <>{children}</>;
}

export default AdminRoute;
