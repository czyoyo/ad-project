// 기본 사용자 정보 인터페이스
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
}

// 로그인 자격 증명
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 회원가입 데이터
export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

// 비밀번호 변경 데이터
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 사용자 프로필 업데이트 데이터
export interface ProfileUpdateData {
  nickname?: string;
  profileImage?: File | null;
}

// 인증 응답 인터페이스
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// 비밀번호 재설정 요청
export interface PasswordResetRequest {
  password: string;
}

// 사용자 상태 (활성, 비활성 등)
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}
