// 리듀서들 가져오기
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import shopReducer from './slices/shopSlice';
import categoriesReducer from './slices/categoriesSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// persist 설정 - 사용자 인증 정보 유지
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'isAuthenticated'], // 이 상태들만 유지
};

// persist 설정 - UI 설정 유지
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['isDarkMode', 'viewMode', 'itemsPerPage'], // 이 설정들만 유지
};

// persist 설정 - 사용자 즐겨찾기 유지
const shopPersistConfig = {
  key: 'shop',
  storage,
  whitelist: ['favorites'], // 즐겨찾기만 유지
};

// 루트 리듀서 설정
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  shop: persistReducer(shopPersistConfig, shopReducer),
  categories: categoriesReducer, // 이 데이터는 유지할 필요 없음
});

// Redux 스토어 설정
export const store = configureStore({
  reducer: rootReducer,
  // 개발 환경에서 DevTools 활성화
  devTools: import.meta.env.MODE !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist 액션 직렬화 검사 제외
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // 직렬화할 수 없는 값이 있는 경로 무시
        ignoredPaths: ['auth.user.someNonSerializableProperty'],
      },
    }),
});

// 지속적인 스토어 생성
export const persistor = persistStore(store);

// 타입 내보내기
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 타입이 지정된 훅 생성
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
