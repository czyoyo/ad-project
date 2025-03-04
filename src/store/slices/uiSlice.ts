import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 토스트 메시지 타입 정의
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // 밀리초 단위, 기본값은 아래에서 설정
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  title?: string; // 이 속성도 필요하다면 추가
}

// 모달 상태 타입 정의
export interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  modalProps: Record<string, unknown>;
}

// UI 상태 타입 정의
interface UiState {
  // 토스트 메시지 관리
  toasts: ToastMessage[];

  // 모달 관리
  modal: ModalState;

  // 테마 관리
  isDarkMode: boolean;

  // 로딩 상태 관리
  isPageLoading: boolean;
  loadingText: string | null;

  // 메뉴/사이드바 상태
  isSidebarOpen: boolean;

  // 기타 UI 설정
  viewMode: 'grid' | 'list';
  itemsPerPage: number;
}

// 초기 상태 설정
const initialState: UiState = {
  toasts: [],
  modal: {
    isOpen: false,
    modalType: null,
    modalProps: {},
  },
  isDarkMode: false,
  isPageLoading: false,
  loadingText: null,
  isSidebarOpen: false,
  viewMode: 'grid',
  itemsPerPage: 12,
};

// UI 슬라이스 생성
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 토스트 메시지 관련 리듀서
    showToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      const newToast: ToastMessage = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 5000, // 기본 지속 시간 5초
      };
      state.toasts.push(newToast);
    },

    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    clearAllToasts(state) {
      state.toasts = [];
    },

    // 모달 관련 리듀서
    openModal(
      state,
      action: PayloadAction<{ modalType: string; modalProps?: Record<string, unknown> }>,
    ) {
      state.modal = {
        isOpen: true,
        modalType: action.payload.modalType,
        modalProps: action.payload.modalProps || {},
      };
    },

    closeModal(state) {
      state.modal = {
        isOpen: false,
        modalType: null,
        modalProps: {},
      };
    },

    // 테마 관련 리듀서
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },

    setDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload;
    },

    // 로딩 상태 관련 리듀서
    setPageLoading(state, action: PayloadAction<{ isLoading: boolean; text?: string | null }>) {
      state.isPageLoading = action.payload.isLoading;
      state.loadingText = action.payload.text || null;
    },

    // 사이드바 관련 리듀서
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },

    // UI 설정 관련 리듀서
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },

    setItemsPerPage(state, action: PayloadAction<number>) {
      state.itemsPerPage = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const {
  showToast,
  removeToast,
  clearAllToasts,
  openModal,
  closeModal,
  toggleDarkMode,
  setDarkMode,
  setPageLoading,
  toggleSidebar,
  setSidebarOpen,
  setViewMode,
  setItemsPerPage,
} = uiSlice.actions;

export default uiSlice.reducer;
