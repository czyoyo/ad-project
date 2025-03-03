import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ToastContainer from '../components/ui/Toast/ToastContainer';

/**
 * 메인 레이아웃 컴포넌트
 * 헤더, 푸터, 토스트 메시지를 포함한 기본 레이아웃
 */
const MainLayout: React.FC = () => {
  const { isLoading } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* 푸터 */}
      <Footer />

      {/* 토스트 메시지 */}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
