import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

// 토스트 메시지 타입 정의
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

// 토스트 컨텍스트 인터페이스
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// 기본값으로 초기화된 토스트 컨텍스트
const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number;
  defaultPosition?: Toast['position'];
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultDuration = 5000,
  defaultPosition = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 토스트 추가 함수
  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Date.now().toString();
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration || defaultDuration,
        position: toast.position || defaultPosition,
      };

      setToasts((prevToasts) => {
        // 최대 토스트 수 제한
        const updatedToasts = [newToast, ...prevToasts];
        return updatedToasts.slice(0, maxToasts);
      });

      // 자동 제거 타이머 설정 (duration이 0이면 자동 제거하지 않음)
      if ((newToast.duration ?? 0) > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [defaultDuration, defaultPosition, maxToasts],
  );

  // 토스트 제거 함수
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // 모든 토스트 제거 함수
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // ESC 키를 누르면 모든 토스트 제거
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearAllToasts();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [clearAllToasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      {/* 토스트 렌더링 컴포넌트 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// 토스트 렌더링 컴포넌트
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  // 위치별로 토스트 그룹화
  const groupedToasts = toasts.reduce<Record<string, Toast[]>>((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  // 위치별 스타일 매핑
  const positionStyles: Record<string, string> = {
    'top-right': 'fixed top-4 right-4 flex flex-col items-end',
    'top-left': 'fixed top-4 left-4 flex flex-col items-start',
    'bottom-right': 'fixed bottom-4 right-4 flex flex-col items-end',
    'bottom-left': 'fixed bottom-4 left-4 flex flex-col items-start',
    'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
    'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
  };

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className={positionStyles[position]}>
          {positionToasts.map((toast) => (
            <div
              key={toast.id}
              className={`mb-2 p-4 rounded shadow-lg max-w-sm w-full animate-fade-in-down ${getToastTypeClass(toast.type)}`}
              role="alert"
            >
              <div className="flex justify-between items-start">
                <div>
                  {toast.title && <h3 className="font-bold">{toast.title}</h3>}
                  <p>{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

// 토스트 타입별 스타일 클래스
const getToastTypeClass = (type: Toast['type']): string => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
  }
};

// 토스트 컨텍스트를 사용하기 위한 커스텀 훅
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
