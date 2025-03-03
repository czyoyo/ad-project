/**
 * 데이터 유효성 검사 관련 유틸리티 함수
 */

/**
 * 이메일 주소 유효성 검사
 * @param email 검사할 이메일 주소
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * 최소 8자 이상, 영문자, 숫자, 특수문자 포함
 * @param password 검사할 비밀번호
 */
export function isValidPassword(password: string): boolean {
  // 8자 이상, 영문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * 비밀번호 강도 평가 (1-5)
 * @param password 평가할 비밀번호
 */
export function passwordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;

  // 길이 점수
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // 복잡성 점수
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*#?&]/.test(password)) score += 1;

  // 다양성 점수
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 1;

  // 최종 점수 (1-5 범위로 조정)
  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * 한국 휴대폰 번호 유효성 검사
 * @param phoneNumber 검사할 전화번호
 */
export function isValidKoreanPhoneNumber(phoneNumber: string): boolean {
  // 숫자만 추출
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  // 01X로 시작하는 10-11자리 숫자 (X는 0, 1, 6, 7, 8, 9)
  const phoneRegex = /^01[016789]\d{7,8}$/;
  return phoneRegex.test(cleanedNumber);
}

/**
 * 한국 주민등록번호 유효성 검사 (형식만 검사, 실제 유효성은 검사하지 않음)
 * @param rrn 검사할 주민등록번호 (000000-0000000 형식)
 */
export function isValidRRNFormat(rrn: string): boolean {
  const rrnRegex = /^\d{6}-\d{7}$/;
  return rrnRegex.test(rrn);
}

/**
 * 한국 사업자등록번호 유효성 검사
 * @param bizNo 검사할 사업자등록번호 (000-00-00000 형식)
 */
export function isValidBusinessNumber(bizNo: string): boolean {
  // 숫자만 추출
  const cleanedNumber = bizNo.replace(/\D/g, '');

  // 형식 검사 (10자리)
  if (cleanedNumber.length !== 10) return false;

  // 가중치
  const weightDigit = [1, 3, 7, 1, 3, 7, 1, 3, 5];

  // 검증
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedNumber.charAt(i)) * weightDigit[i];
  }

  sum += (parseInt(cleanedNumber.charAt(8)) * 5) / 10;

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleanedNumber.charAt(9));
}

/**
 * URL 유효성 검사
 * @param url 검사할 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 한국 우편번호 유효성 검사
 * @param zipCode 검사할 우편번호
 */
export function isValidKoreanZipCode(zipCode: string): boolean {
  // 숫자만 추출
  const cleanedZipCode = zipCode.replace(/\D/g, '');

  // 5자리 숫자인지 확인
  return /^\d{5}$/.test(cleanedZipCode);
}

/**
 * 신용카드 번호 유효성 검사 (Luhn 알고리즘)
 * @param cardNumber 검사할 카드 번호
 */
export function isValidCreditCardNumber(cardNumber: string): boolean {
  // 숫자와 공백만 허용하고 나머지는 제거
  const cleanedNumber = cardNumber.replace(/[^\d]/g, '');

  // 길이 확인 (13-19자리)
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) return false;

  // Luhn 알고리즘 검증
  let sum = 0;
  let alternate = false;

  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cleanedNumber.charAt(i));

    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }

    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/**
 * 비어있지 않은 값인지 확인
 * @param value 검사할 값
 */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value || {}).length > 0;

  return true;
}

/**
 * 숫자 범위 내에 있는지 확인
 * @param value 검사할 값
 * @param min 최소값
 * @param max 최대값
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 안전한 문자열인지 확인 (XSS 방지)
 * @param input 검사할 문자열
 */
export function isSafeString(input: string): boolean {
  // 스크립트 태그, 이벤트 핸들러, 데이터 URI 등 위험한 패턴 검사
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /on\w+\s*=/i,
    /javascript:/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}

/**
 * 성인 여부 확인 (만 19세 이상)
 * @param birthDate 생년월일
 */
export function isAdult(birthDate: Date | string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);

  // 만 나이 계산
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // 생일이 아직 지나지 않았으면 나이에서 1 빼기
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 19;
}

export default {
  isValidEmail,
  isValidPassword,
  passwordStrength,
  isValidKoreanPhoneNumber,
  isValidRRNFormat,
  isValidBusinessNumber,
  isValidUrl,
  isValidKoreanZipCode,
  isValidCreditCardNumber,
  isNotEmpty,
  isInRange,
  isSafeString,
  isAdult,
};
