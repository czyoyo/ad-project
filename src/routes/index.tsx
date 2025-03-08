import { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';

// 보호된 라우트 컴포넌트
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

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
import ForbiddenPage from '../pages/ForbiddenPage/ForbiddenPage';
import ProductSearch from '../pages/CategorySearch/ProductSearch.tsx';
import AdultShopList from '../pages/AdultShopList/AdultShopList.tsx';
import AdultProductList from '../pages/AdultProductList/AdultProductList.tsx';

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
        <Route path="/product-search" element={<ProductSearch />} />
        <Route path="/adult-shop-list" element={<AdultShopList />} />
        <Route path="/adult-product-list" element={<AdultProductList />} />
        <Route path="/403" element={<ForbiddenPage />} /> {/* 🔥 403 접근 금지 페이지 */}
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
        {/* 관리자 전용 라우트 예시 */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              {/* 여기에 관리자 컴포넌트를 넣으세요 */}
              <div>관리자 페이지</div>
            </AdminRoute>
          }
        />
      </Route>

      {/* 인증 레이아웃으로 감싸진 라우트 */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute restrictedWhenAuthenticated={true}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute restrictedWhenAuthenticated={true}>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute restrictedWhenAuthenticated={false}>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute restrictedWhenAuthenticated={false}>
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
