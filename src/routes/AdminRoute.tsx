// src/routes/AdminRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * 관리자 라우트 컴포넌트
 * 관리자 권한이 있는 사용자만 접근할 수 있는 라우트를 정의합니다.
 * 권한이 없는 사용자는 접근 거부 페이지로 리디렉션됩니다.
 *
 * @param children 렌더링할 컴포넌트
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized, user } = useSelector((state: RootState) => state.auth);

  // 인증 초기화 중인 경우 로딩 표시
  if (!isInitialized) {
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

  // 관리자 권한이 없는 경우 접근 거부 페이지로 리디렉션
  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  // 관리자인 경우 정상적으로 컴포넌트 표시
  return <>{children}</>;
};

export default AdminRoute;
