import axiosInstance from '../api/base.api';
import { User, RegisterData, AuthResponse, PasswordChangeData } from '../types/user.types';
import { authStorage, userStorage } from '../utils/localStorage';

/**
 * 인증 관련 서비스
 */
export class AuthService {
  private API_URL = '/auth';

  /**
   * 사용자 로그인
   * @param email 이메일
   * @param password 비밀번호
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`${this.API_URL}/login`, {
        email,
        password,
      });

      const { data } = response;

      // 토큰 저장
      if (data.token) {
        authStorage.setToken(data.token);
      }

      if (data.refreshToken) {
        authStorage.setRefreshToken(data.refreshToken);
      }

      // 사용자 정보 저장
      if (data.user) {
        userStorage.setUserInfo(data.user);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * 사용자 회원가입
   * @param userData 회원가입 데이터
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`${this.API_URL}/register`, userData);

      const { data } = response;

      // 토큰 저장
      if (data.token) {
        authStorage.setToken(data.token);
      }

      if (data.refreshToken) {
        authStorage.setRefreshToken(data.refreshToken);
      }

      // 사용자 정보 저장
      if (data.user) {
        userStorage.setUserInfo(data.user);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * 사용자 로그아웃
   */
  logout(): void {
    authStorage.clearAuthData();
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<{ token: string; refreshToken?: string }> {
    try {
      const refreshToken = authStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await axiosInstance.post<{ token: string; refreshToken?: string }>(
        `${this.API_URL}/refresh-token`,
        { refreshToken },
      );

      const { data } = response;

      // 새 토큰 저장
      if (data.token) {
        authStorage.setToken(data.token);
      }

      if (data.refreshToken) {
        authStorage.setRefreshToken(data.refreshToken);
      }

      return data;
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃
      this.logout();
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`${this.API_URL}/me`);

      // 사용자 정보 업데이트
      userStorage.setUserInfo(response.data);

      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * 비밀번호 찾기
   * @param email 사용자 이메일
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        `${this.API_URL}/forgot-password`,
        { email },
      );
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * 비밀번호 재설정
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        `${this.API_URL}/reset-password`,
        { token, newPassword },
      );
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * 비밀번호 변경
   * @param passwordData
   */
  async changePassword(passwordData: PasswordChangeData): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        `${this.API_URL}/change-password`,
        passwordData,
      );
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * 이메일 확인 토큰 검증
   * @param token 이메일 확인 토큰
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        `${this.API_URL}/verify-email`,
        { token },
      );
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * 현재 토큰의 만료 시간 확인
   */
  isTokenExpired(): boolean {
    const token = authStorage.getToken();

    if (!token) {
      return true;
    }

    try {
      const decoded: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Token decode error:', error);
      return true;
    }
  }

  /**
   * 사용자가 인증되어 있는지 확인
   */
  isAuthenticated(): boolean {
    return !!authStorage.getToken() && !this.isTokenExpired();
  }
}

export default new AuthService();
