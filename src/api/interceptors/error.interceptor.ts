import axios, { AxiosError } from 'axios';
import { store } from '../../store/store.ts';
import { logout, setAuthError, setAuthLoading } from '../../store/slices/authSlice.ts';
import { showToast } from '../../store/slices/uiSlice.ts';
import { AuthService } from '../../services/auth.service.ts';

/**
 * 오류 인터셉터는 API 응답의 오류를 처리합니다.
 * 주요 기능:
 * 1. 401 오류(인증 실패) 발생 시 토큰 갱신 시도
 * 2. 토큰 갱신 실패 시 로그아웃 처리
 * 3. 기타 오류에 대한 메시지 표시
 * 4. 로딩 상태 관리
 */
export const errorInterceptor = async (error: AxiosError) => {
  // 로딩 상태 비활성화
  store.dispatch(setAuthLoading(false));

  // 오류 응답이 존재하는 경우
  if (error.response) {
    const { status, data } = error.response;

    // 401 오류 (인증 실패) 처리
    if (status === 401) {
      // 오류 메시지에 'token expired'가 포함되어 있다면 토큰 갱신 시도
      if (
        data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof data.message === 'string' &&
        data.message.includes('token expired')
      ) {
        try {
          // 토큰 갱신 시도
          const authService = new AuthService();
          await authService.refreshToken();

          // 토큰 갱신 성공 시 원래 요청 재시도
          // 원래 요청 정보가 있는 경우에만 재시도
          if (error.config) {
            // Axios 인스턴스로 원래 요청 재시도
            return axios(error.config);
          }
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃 처리
          console.error('토큰 갱신 실패:', error);
          store.dispatch(logout());
          store.dispatch(
            showToast({
              type: 'error',
              message: '세션이 만료되었습니다. 다시 로그인해주세요.',
            }),
          );
        }
      } else {
        // 기타 인증 오류 (잘못된 자격 증명 등)
        store.dispatch(setAuthError('인증에 실패했습니다. 자격 증명을 확인해주세요.'));
      }
    }

    // 403 오류 (권한 부족) 처리
    else if (status === 403) {
      store.dispatch(
        showToast({
          type: 'error',
          message: '이 작업을 수행할 권한이 없습니다.',
        }),
      );
    }

    // 404 오류 (리소스 없음) 처리
    else if (status === 404) {
      store.dispatch(
        showToast({
          type: 'error',
          message: '요청한 리소스를 찾을 수 없습니다.',
        }),
      );
    }

    // 429 오류 (요청 제한) 처리
    else if (status === 429) {
      store.dispatch(
        showToast({
          type: 'error',
          message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        }),
      );
    }

    // 500 오류 (서버 오류) 처리
    else if (status >= 500) {
      store.dispatch(
        showToast({
          type: 'error',
          message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
        }),
      );
    }

    // 기타 오류 처리
    else {
      // 응답에서 오류 메시지 추출
      let errorMessage = '오류가 발생했습니다.';
      if (data && typeof data === 'object' && 'message' in data) {
        errorMessage = typeof data.message === 'string' ? data.message : errorMessage;
      }

      store.dispatch(
        showToast({
          type: 'error',
          message: errorMessage,
        }),
      );
    }
  }

  // 네트워크 오류 처리 (응답이 없는 경우)
  else if (error.request) {
    store.dispatch(
      showToast({
        type: 'error',
        message: '네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
      }),
    );
  }

  // 기타 오류 처리
  else {
    store.dispatch(
      showToast({
        type: 'error',
        message: `오류가 발생했습니다: ${error.message}`,
      }),
    );
  }

  // 에러를 Promise.reject로 반환하여 요청자에게 오류를 전달
  return Promise.reject(error);
};
