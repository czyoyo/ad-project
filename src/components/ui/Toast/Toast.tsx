import { useState, useEffect, JSX } from 'react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  onClose: () => void;
}

/**
 * 개별 토스트 메시지 컴포넌트
 */
function Toast({ id, type, message, title, onClose }: ToastProps): JSX.Element {
  const [isExiting, setIsExiting] = useState(false);

  // 토스트 타입에 따른 스타일 클래스
  const typeClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-500',
    error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-red-500',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border-yellow-500',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-blue-500',
  };

  // 토스트 타입에 따른 아이콘
  const typeIcons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  };

  // 닫기 버튼 클릭 핸들러
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // 애니메이션 후 실제 제거
  };

  // ESC 키로 토스트 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      data-id={id} // 여기에 id 속성을 추가
      className={`max-w-xs w-full p-4 rounded shadow-lg border-l-4 ${typeClasses[type]} ${
        isExiting ? 'animate-fade-out-up' : 'animate-fade-in-down'
      } transition-opacity duration-300`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{typeIcons[type]}</div>
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        <button
          type="button"
          className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
