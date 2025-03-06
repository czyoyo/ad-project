import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RegisterData, User } from '../types/user.types';
import authApi from '../api/auth.api';
import { authStorage } from '../utils/localStorage';
import {
  setUser,
  setToken,
  setAuthLoading,
  setAuthError,
  logout as logoutAction,
} from '../store/slices/authSlice';

/**
 * 인증 관련 기능을 제공하는 커스텀 훅
 *
 * 이 훅은 로그인, 로그아웃, 회원가입, 현재 사용자 정보 등의 인증 관련 기능을
 * 컴포넌트에서 쉽게 사용할 수 있도록 합니다.
 *
 * @returns 인증 관련 상태와 함수들
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  /**
   * 로그인 함수
   * @param email 사용자 이메일
   * @param password 사용자 비밀번호
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      try {
        // API 호출
        const response = await authApi.login({ email, password });

        // 응답 데이터에서 사용자 정보와 토큰 추출
        const { data } = response;

        if (data && data.token) {
          // 토큰 저장
          authStorage.setStorageToken(data.token);

          // 리프레시 토큰이 있다면 저장
          if (data.refreshToken) {
            authStorage.setStorageRefreshToken(data.refreshToken);
          }

          // Redux 상태 업데이트
          dispatch(setToken(data.token));
          dispatch(setUser(data.user));
          dispatch(setAuthLoading(false));

          return true;
        } else {
          throw new Error('Invalid response data');
        }
      } catch (error) {
        // 에러 처리
        console.error('Login error:', error);

        let errorMessage = '로그인에 실패했습니다.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatch(setAuthError(errorMessage));
        dispatch(setAuthLoading(false));

        return false;
      }
    },
    [dispatch],
  );

  /**
   * 회원가입 함수
   * @param userData 회원가입 데이터
   */
  const register = useCallback(
    async (userData: RegisterData): Promise<boolean> => {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      try {
        // API 호출
        const response = await authApi.register(userData);

        // 응답 데이터에서 사용자 정보와 토큰 추출
        const { data } = response;

        if (data && data.token) {
          // 토큰 저장
          authStorage.setStorageToken(data.token);

          // 리프레시 토큰이 있다면 저장
          if (data.refreshToken) {
            authStorage.setStorageRefreshToken(data.refreshToken);
          }

          // Redux 상태 업데이트
          dispatch(setToken(data.token));
          dispatch(setUser(data.user));
          dispatch(setAuthLoading(false));

          return true;
        } else {
          throw new Error('Invalid response data');
        }
      } catch (error) {
        // 에러 처리
        console.error('Registration error:', error);

        let errorMessage = '회원가입에 실패했습니다.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatch(setAuthError(errorMessage));
        dispatch(setAuthLoading(false));

        return false;
      }
    },
    [dispatch],
  );

  /**
   * 로그아웃 함수
   */
  const logout = useCallback(() => {
    try {
      // 백엔드 로그아웃 API 호출 (선택적)
      // await authApi.logout();

      // Redux 상태 업데이트 및 로컬 스토리지 토큰 제거
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout error:', error);
      // 오류가 발생해도 로컬 상태는 로그아웃 처리
      dispatch(logoutAction());
    }
  }, [dispatch]);

  /**
   * 현재 사용자 정보 가져오기
   */
  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    if (!authState.token) {
      return null;
    }

    dispatch(setAuthLoading(true));

    try {
      // API 호출
      const response = await authApi.getCurrentUser();

      // Redux 상태 업데이트
      if (response.data) {
        dispatch(setUser(response.data));
        dispatch(setAuthLoading(false));
        return response.data;
      }

      dispatch(setAuthLoading(false));
      return null;
    } catch (error) {
      console.error('Get current user error:', error);

      let errorMessage = '사용자 정보를 가져오는데 실패했습니다.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch(setAuthError(errorMessage));
      dispatch(setAuthLoading(false));

      return null;
    }
  }, [authState.token, dispatch]);

  /**
   * 프로필 업데이트
   * @param userData 업데이트할 사용자 데이터
   */
  const updateProfile = useCallback(
    async (userData: Partial<User>): Promise<boolean> => {
      dispatch(setAuthLoading(true));

      try {
        // API 호출
        const response = await authApi.updateProfile(userData);

        // Redux 상태 업데이트
        if (response.data) {
          dispatch(setUser(response.data));
          dispatch(setAuthLoading(false));

          return true;
        }

        dispatch(setAuthLoading(false));
        return false;
      } catch (error) {
        console.error('Update profile error:', error);

        let errorMessage = '프로필 업데이트에 실패했습니다.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatch(setAuthError(errorMessage));
        dispatch(setAuthLoading(false));

        return false;
      }
    },
    [dispatch],
  );

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
  };
};

export default useAuth;
