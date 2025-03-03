/**
 * 날짜와 시간 관련 유틸리티 함수들입니다.
 */

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 */
export const formatDate = (date: Date | number | string): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 YYYY년 MM월 DD일 형식의 문자열로 변환합니다.
 */
export const formatDateKorean = (date: Date | number | string): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜와 시간을 YYYY-MM-DD HH:MM:SS 형식의 문자열로 변환합니다.
 */
export const formatDateTime = (date: Date | number | string): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 시간을 HH:MM 형식의 문자열로 변환합니다.
 */
export const formatTime = (date: Date | number | string): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

/**
 * 현재 날짜와 시간을 반환합니다.
 */
export const getCurrentDateTime = (): Date => {
  return new Date();
};

/**
 * 날짜에 일수를 더합니다.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 두 날짜 사이의 일수를 계산합니다.
 */
export const getDaysDifference = (
  start: Date | number | string,
  end: Date | number | string,
): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // 시간, 분, 초를 0으로 설정하여 날짜만 비교
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
};

/**
 * 날짜가 오늘인지 확인합니다.
 */
export const isToday = (date: Date | number | string): boolean => {
  const d = new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * 상대적인 시간을 표시합니다 (예: "3분 전", "1시간 전").
 */
export const getRelativeTime = (date: Date | number | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
};
