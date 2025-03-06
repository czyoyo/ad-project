import { LoginCredentials, RegisterData, User } from '../../types/user.types.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authStorage } from '../../utils/localStorage.ts';
import { AuthService } from '../../services/auth.service.ts';

// 비동기 액션 생성
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const authService = new AuthService();
      const result = await authService.login(credentials.email, credentials.password);
      authStorage.setStorageToken(result.token); // @@
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const authService = new AuthService();
      const result = await authService.register(userData);
      authStorage.setStorageToken(result.token); // @@
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  },
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const authService = new AuthService();
      const result = await authService.refreshToken();
      authStorage.setStorageToken(result.token); // @@
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '토큰 갱신에 실패했습니다.');
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const authService = new AuthService();
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.',
      );
    }
  },
);

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // 이 속성 추가
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false, // 초기값 설정
};

const authSlice = createSlice({
  name: 'auth', // 액션 타입의 접두사(prefix)를 생성, ex) const loginAction = { type: 'auth/login', payload: { username: 'user1' } };

  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      authStorage.setStorageToken(action.payload); // @@
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authStorage.removeStorageToken(); // @@
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 로그인 처리
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 회원가입 처리
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 토큰 갱신 처리
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        authStorage.removeStorageToken(); // @@
      });

    // 현재 사용자 정보 가져오기
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setToken, setAuthLoading, setAuthError, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
