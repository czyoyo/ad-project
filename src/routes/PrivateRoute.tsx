// src/routes/PrivateRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * 비공개 라우트 컴포넌트
 * 인증된 사용자만 접근할 수 있는 라우트를 정의합니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리디렉션됩니다.
 *
 * @param children 렌더링할 컴포넌트
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
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

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    // 현재 경로 정보를 state로 전달하여 로그인 후 돌아올 수 있도록 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 경우 정상적으로 컴포넌트 표시
  return <>{children}</>;
};

export default PrivateRoute;
