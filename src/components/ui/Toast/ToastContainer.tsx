import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { removeToast } from '../../../store/slices/uiSlice';
import Toast from './Toast';

/**
 * 토스트 메시지 컨테이너 컴포넌트
 * 앱 전역에서 사용되는 토스트 메시지 표시
 */
const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.ui);

  // 토스트 메시지 자동 제거 처리
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  // 그룹화된 토스트 메시지
  const topRightToasts = toasts.filter(
    (toast) => !toast.position || toast.position === 'top-right',
  );
  const topLeftToasts = toasts.filter((toast) => toast.position === 'top-left');
  const bottomRightToasts = toasts.filter((toast) => toast.position === 'bottom-right');
  const bottomLeftToasts = toasts.filter((toast) => toast.position === 'bottom-left');
  const topCenterToasts = toasts.filter((toast) => toast.position === 'top-center');
  const bottomCenterToasts = toasts.filter((toast) => toast.position === 'bottom-center');

  // 위치별 스타일 클래스
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2',
    'top-left': 'fixed top-4 left-4 z-50 flex flex-col items-start space-y-2',
    'bottom-right':
      'fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end space-y-2 space-y-reverse',
    'bottom-left':
      'fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start space-y-2 space-y-reverse',
    'top-center':
      'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2',
    'bottom-center':
      'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col-reverse items-center space-y-2 space-y-reverse',
  };

  // 각 위치별 토스트 메시지 렌더링
  const renderToasts = (toastList: typeof toasts, position: keyof typeof positionClasses) => {
    if (toastList.length === 0) return null;

    return (
      <div className={positionClasses[position]}>
        {toastList.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            title={toast.title}
            onClose={() => dispatch(removeToast(toast.id))}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {renderToasts(topRightToasts, 'top-right')}
      {renderToasts(topLeftToasts, 'top-left')}
      {renderToasts(bottomRightToasts, 'bottom-right')}
      {renderToasts(bottomLeftToasts, 'bottom-left')}
      {renderToasts(topCenterToasts, 'top-center')}
      {renderToasts(bottomCenterToasts, 'bottom-center')}
    </>
  );
};

export default ToastContainer;
