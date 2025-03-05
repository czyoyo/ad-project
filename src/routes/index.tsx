import { ReactNode, JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// 레이아웃
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// 페이지
import Home from '../pages/Home/Home';
import ShopDetail from '../pages/ShopDetail/ShopDetail';
import Search from '../pages/Search/Search';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import Favorites from '../pages/Favorites/Favorites';
import NotFound from '../pages/NotFound/NotFound';
import CategoryList from '../pages/CategoryList/CategoryList';
import AboutUs from '../pages/AboutUs/AboutUs';
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsOfService from '../pages/Legal/TermsOfService';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Contact from '../pages/Contact/Contact';

// 보호된 라우트 컴포넌트
// 보호된 라우트 컴포넌트
interface RouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: RouteProps): JSX.Element {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// 공개 라우트 컴포넌트 (로그인 상태에서는 접근 불가)
function PublicRoute({ children }: RouteProps): JSX.Element {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes(): JSX.Element {
  return (
    <Routes>
      {/* 메인 레이아웃으로 감싸진 라우트 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shops/:id" element={<ShopDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/:slug" element={<CategoryList />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* 인증이 필요한 라우트 */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 인증 레이아웃으로 감싸진 라우트 */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Route>

      {/* 404 페이지 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
