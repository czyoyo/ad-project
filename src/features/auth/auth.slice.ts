// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData, PasswordChangeData } from '../../types/user.types';
import { authStorage, userStorage } from '../../utils/localStorage';
import AuthService from '../../services/auth.service';

// 비동기 액션 생성
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await AuthService.login(credentials.email, credentials.password);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      return await AuthService.register(userData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.refreshToken();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '토큰 갱신에 실패했습니다.');
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.',
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: PasswordChangeData, { rejectWithValue }) => {
    try {
      // API 호출 예시 (실제 구현 필요)
      await AuthService.changePassword(passwordData);
      return '비밀번호가 성공적으로 변경되었습니다.';
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.',
      );
    }
  },
);

// Auth 상태 인터페이스
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// 초기 상태
const initialState: AuthState = {
  user: userStorage.getUserInfo(),
  token: authStorage.getToken(),
  isAuthenticated: !!authStorage.getToken() && !AuthService.isTokenExpired(),
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Auth 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 상태 초기화 완료
    setInitialized(state) {
      state.isInitialized = true;
    },

    // 사용자 설정
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      userStorage.setUserInfo(action.payload);
    },

    // 토큰 설정
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      authStorage.setToken(action.payload);
    },

    // 로딩 상태 설정
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // 에러 설정
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // 로그아웃
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authStorage.clearAuthData();
    },

    // 에러 초기화
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 로그인 액션 처리
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 회원가입 액션 처리
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 토큰 갱신 액션 처리
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // 현재 사용자 정보 가져오기 액션 처리
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 비밀번호 변경 액션 처리
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 액션 생성자 내보내기
export const {
  setInitialized,
  setUser,
  setToken,
  setAuthLoading,
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer; // Redux Toolkit 사용 시
