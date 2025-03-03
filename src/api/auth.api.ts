// src/api/auth.api.ts

import baseApi from './index';
import { LoginCredentials, RegisterData, User, AuthResponse } from '../types/user.types';
import { ApiResponse } from '../types/api.types';

/**
 * 인증 관련 API 요청 함수들
 * 로그인, 회원가입, 토큰 갱신 등의 API 엔드포인트를 호출합니다.
 */
const authApi = {
  /**
   * 사용자 로그인
   * @param credentials 로그인 자격 증명(이메일, 비밀번호)
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },

  /**
   * 사용자 회원가입
   * @param userData 회원가입 데이터
   */
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data;
  },

  /**
   * 토큰 갱신
   * @param refreshToken 리프레시 토큰
   */
  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<{ token: string; refreshToken?: string }>> => {
    const response = await baseApi.post<ApiResponse<{ token: string; refreshToken?: string }>>(
      '/auth/refresh-token',
      { refreshToken },
    );
    return response.data;
  },

  /**
   * 현재 사용자 정보 가져오기
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await baseApi.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  /**
   * 사용자 로그아웃
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await baseApi.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  /**
   * 비밀번호 변경
   * @param currentPassword 현재 비밀번호
   * @param newPassword 새 비밀번호
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> => {
    const response = await baseApi.post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * 비밀번호 찾기 요청
   * @param email 사용자 이메일
   */
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await baseApi.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * 비밀번호 재설정
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await baseApi.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  /**
   * 이메일 인증
   * @param token 이메일 인증 토큰
   */
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await baseApi.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      token,
    });
    return response.data;
  },

  /**
   * 사용자 프로필 업데이트
   * @param userData 업데이트할 사용자 데이터
   */
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await baseApi.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data;
  },

  /**
   * 프로필 이미지 업로드
   * @param imageFile 이미지 파일
   */
  uploadProfileImage: async (imageFile: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await baseApi.post<ApiResponse<{ imageUrl: string }>>(
      '/auth/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};

export default authApi;
