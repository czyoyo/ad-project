/**
 * 날짜 및 시간 관련 유틸리티 함수
 */

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param date 날짜 객체 또는 타임스탬프
 */
export function formatDate(date: Date | number | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 시간을 HH:MM 형식으로 포맷팅
 * @param date 날짜 객체 또는 타임스탬프
 */
export function formatTime(date: Date | number | string): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * 날짜와 시간을 YYYY-MM-DD HH:MM:SS 형식으로 포맷팅
 * @param date 날짜 객체 또는 타임스탬프
 */
export function formatDateTime(date: Date | number | string): string {
  const d = new Date(date);
  const formattedDate = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${formattedDate} ${hours}:${minutes}:${seconds}`;
}

/**
 * 현재 시간부터 얼마나 지났는지 상대적으로 표시
 * (예: "방금 전", "5분 전", "어제", "2주 전")
 * @param date 날짜 객체 또는 타임스탬프
 */
export function timeAgo(date: Date | number | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  // 미래 시간인 경우
  if (seconds < 0) {
    return '미래';
  }

  // 단위별 시간 간격
  const intervals = {
    년: 31536000,
    개월: 2592000,
    주: 604800,
    일: 86400,
    시간: 3600,
    분: 60,
    초: 1,
  };

  // 적절한 시간 단위 찾기
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);

    if (interval >= 1) {
      return unit === '초' && interval < 10 ? '방금 전' : `${interval}${unit} 전`;
    }
  }

  return '방금 전';
}

/**
 * 영업 시간 확인
 * @param openTime 영업 시작 시간 (HH:MM 형식)
 * @param closeTime 영업 종료 시간 (HH:MM 형식)
 * @param currentTime 확인할 시간 (기본값: 현재 시간)
 */
export function isBusinessHourOpen(
  openTime: string,
  closeTime: string,
  currentTime: Date = new Date(),
): boolean {
  if (!openTime || !closeTime) return false;

  // 현재 시간
  const current = new Date(currentTime);
  const currentHours = current.getHours();
  const currentMinutes = current.getMinutes();

  // 영업 시작 시간
  const [openHours, openMinutes] = openTime.split(':').map(Number);

  // 영업 종료 시간
  const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

  // 시간을 분 단위로 변환하여 비교
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const openTotalMinutes = openHours * 60 + openMinutes;
  const closeTotalMinutes = closeHours * 60 + closeMinutes;

  // 자정을 넘어가는 영업 시간 처리
  if (openTotalMinutes < closeTotalMinutes) {
    return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes;
  } else {
    return currentTotalMinutes >= openTotalMinutes || currentTotalMinutes < closeTotalMinutes;
  }
}

/**
 * 두 날짜 사이의 일수 계산
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜 (기본값: 현재 날짜)
 */
export function daysBetween(
  startDate: Date | number | string,
  endDate: Date | number | string = new Date(),
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 시간, 분, 초를 제거하여 날짜만 비교
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 밀리초 단위로 차이 계산 후 일수로 변환
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 날짜에 일수 추가
 * @param date 원본 날짜
 * @param days 추가할 일수
 */
export function addDays(date: Date | number | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 특정 요일의 한글 이름 반환
 * @param dayIndex 요일 인덱스 (0: 일요일, 1: 월요일, ...)
 */
export function getDayName(dayIndex: number): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[dayIndex % 7];
}

/**
 * 날짜를 yyyy년 M월 d일 (요일) 형식으로 포맷팅
 * @param date 날짜 객체 또는 타임스탬프
 */
export function formatKoreanDate(date: Date | number | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = getDayName(d.getDay());

  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  timeAgo,
  isBusinessHourOpen,
  daysBetween,
  addDays,
  getDayName,
  formatKoreanDate,
};
