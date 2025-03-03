/**
 * 유효성 검사 관련 유틸리티 함수들입니다.
 */

/**
 * 이메일 주소 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사
 * 최소 8자, 하나 이상의 대문자, 소문자, 숫자 포함
 */
export const isValidPassword = (password: string): boolean => {
  // 최소 8자, 대문자, 소문자, 숫자 각 1개 이상 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 한국 휴대폰 번호 유효성 검사
 */
export const isValidKoreanPhoneNumber = (phoneNumber: string): boolean => {
  // 하이픈 제거
  const cleaned = phoneNumber.replace(/-/g, '');
  // 01로 시작하는 10-11자리 숫자
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(cleaned);
};

/**
 * 한국 주민등록번호 유효성 검사
 */
export const isValidKoreanRRN = (rrn: string): boolean => {
  // 하이픈 제거
  const cleaned = rrn.replace(/-/g, '');

  // 13자리 숫자인지 확인
  if (!/^\d{13}$/.test(cleaned)) {
    return false;
  }

  // 앞 6자리가 유효한 생년월일 형식인지 확인
  const year = parseInt(cleaned.substring(0, 2));
  const month = parseInt(cleaned.substring(2, 4));
  const day = parseInt(cleaned.substring(4, 6));

  // 월이 1-12 범위인지, 일이 1-31 범위인지 확인
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // 검증 로직 (실제 주민번호 검증 알고리즘)
  // 각 자리에 가중치를 곱하여 합산
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * multipliers[i];
  }

  // 나머지 연산 후 검증
  const remainder = (11 - (sum % 11)) % 10;
  const checkDigit = parseInt(cleaned.charAt(12));

  return remainder === checkDigit;
};

/**
 * URL 유효성 검사
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

/**
 * 한국 사업자등록번호 유효성 검사
 */
export const isValidBusinessNumber = (businessNumber: string): boolean => {
  // 하이픈 제거
  const cleaned = businessNumber.replace(/-/g, '');

  // 10자리 숫자인지 확인
  if (!/^\d{10}$/.test(cleaned)) {
    return false;
  }

  // 검증 로직
  const checkDigits = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * checkDigits[i];
  }

  sum += Math.floor((parseInt(cleaned.charAt(8)) * 5) / 10);
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;

  return checkDigit === parseInt(cleaned.charAt(9));
};

/**
 * 문자열이 비어있는지 확인
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === '';
};

/**
 * 숫자 범위 유효성 검사
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 문자열 길이 유효성 검사
 */
export const hasValidLength = (value: string, min: number, max?: number): boolean => {
  const length = value.length;
  if (max === undefined) {
    return length >= min;
  }
  return length >= min && length <= max;
};

/**
 * 한글만 포함하는지 검사
 */
export const isKoreanOnly = (value: string): boolean => {
  return /^[가-힣\s]+$/.test(value);
};

/**
 * 영문만 포함하는지 검사
 */
export const isEnglishOnly = (value: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(value);
};

/**
 * 숫자만 포함하는지 검사
 */
export const isNumericOnly = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * 영문과 숫자만 포함하는지 검사
 */
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * 유효한 파일 확장자인지 검사
 */
export const hasValidExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return allowedExtensions.includes(extension);
};
