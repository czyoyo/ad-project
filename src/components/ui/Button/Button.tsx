import { ButtonHTMLAttributes, ReactNode, MouseEvent, JSX } from 'react';
import styles from './Button.module.css';

// 버튼 크기 타입
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// 버튼 변형 타입
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'white';

// 버튼 프롭스 인터페이스
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  rounded?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 버튼 컴포넌트
 *
 * 애플리케이션 전반에서 사용되는 재사용 가능한 버튼 컴포넌트입니다.
 * 여러 크기, 변형, 아이콘 등의 옵션을 제공합니다.
 *
 * @example
 * // 기본 사용법
 * <Button>버튼 텍스트</Button>
 *
 * // 변형 사용
 * <Button variant="primary" size="lg">큰 기본 버튼</Button>
 *
 * // 아이콘 사용
 * <Button leftIcon={<SearchIcon />}>검색</Button>
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps): JSX.Element {
  // 클래스 이름 조합
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    rounded ? styles.rounded : '',
    isLoading ? styles.loading : '',
    leftIcon || rightIcon ? styles.withIcon : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      {...rest}
    >
      {/* 왼쪽 아이콘 */}
      {leftIcon && !isLoading && <span className={styles.iconLeft}>{leftIcon}</span>}

      {/* 버튼 내용 */}
      {children}

      {/* 오른쪽 아이콘 */}
      {rightIcon && !isLoading && <span className={styles.iconRight}>{rightIcon}</span>}
    </button>
  );
}

export default Button;
