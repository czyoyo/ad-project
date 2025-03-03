/**
 * 데이터 포맷팅 관련 유틸리티 함수들입니다.
 */

/**
 * 숫자를 한국 통화 형식으로 포맷팅합니다 (예: 1,234,567원).
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * 숫자를 천 단위 구분자가 있는 형식으로 포맷팅합니다 (예: 1,234,567).
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다 (예: 1.5MB).
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 전화번호를 포맷팅합니다 (예: 010-1234-5678).
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '');

  // 길이에 따른 포맷팅
  if (cleaned.length === 11) {
    // 휴대폰 번호 (01012345678 -> 010-1234-5678)
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    // 지역번호가 02인 경우 (0212345678 -> 02-1234-5678)
    if (cleaned.startsWith('02')) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 그 외 지역번호 또는 휴대폰 번호 (0101234567 -> 010-123-4567)
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 9) {
    // 02 지역번호 (021234567 -> 02-123-4567)
    if (cleaned.startsWith('02')) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }

  // 포맷팅할 수 없는 경우 그대로 반환
  return phoneNumber;
};

/**
 * 주민등록번호를 포맷팅합니다 (예: 123456-*******).
 */
export const formatRRN = (rrn: string): string => {
  // 숫자와 하이픈만 추출
  const cleaned = rrn.replace(/[^\d-]/g, '');

  // 하이픈이 없는 경우 추가
  if (cleaned.length === 13 && !cleaned.includes('-')) {
    const formatted = cleaned.replace(/(\d{6})(\d{7})/, '$1-$2');
    // 뒷자리는 보안을 위해 *로 표시
    return formatted.substring(0, 8) + '*******';
  }

  // 이미 하이픈이 있는 경우
  if (cleaned.includes('-')) {
    const parts = cleaned.split('-');
    if (parts[1]) {
      return parts[0] + '-*******';
    }
  }

  // 포맷팅할 수 없는 경우 그대로 반환
  return rrn;
};

/**
 * 이메일 주소 마스킹 (예: ab***@example.com).
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [username, domain] = email.split('@');

  if (username.length <= 2) {
    return username + '@' + domain;
  }

  const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
  return maskedUsername + '@' + domain;
};

/**
 * 문자열을 주어진 길이로 자르고 말줄임표(...) 추가.
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
};

/**
 * 숫자에 천 단위 쉼표 추가 (1234 -> 1,234).
 */
export const addCommas = (num: number | string): string => {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 첫 글자를 대문자로 변환.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
