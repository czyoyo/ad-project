import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * 로고 컴포넌트
 */
const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 로고 배경 */}
      <circle cx="25" cy="25" r="20" fill="#8B5CF6" />

      {/* 심볼 - 하트 모양 */}
      <path
        d="M25 35C25 35 15 27.5 15 20C15 16.25 17.5 13.75 20 13.75C22.5 13.75 25 16.25 25 18.75C25 16.25 27.5 13.75 30 13.75C32.5 13.75 35 16.25 35 20C35 27.5 25 35 25 35Z"
        fill="white"
      />

      {/* 별표 효과 */}
      <circle cx="35" cy="15" r="2" fill="white" />
      <circle cx="32" cy="10" r="1" fill="white" />
    </svg>
  );
};

export default Logo;
