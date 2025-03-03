/**
 * 데이터 포맷팅 관련 유틸리티 함수
 */

/**
 * 숫자를 통화 형식으로 포맷팅
 * @param amount 금액
 * @param currencyCode 통화 코드 (기본값: 'KRW')
 * @param locale 로케일 (기본값: 'ko-KR')
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'KRW',
  locale: string = 'ko-KR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 숫자에 천 단위 구분자 추가
 * @param num 포맷팅할 숫자
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 전화번호 포맷팅 (010-1234-5678 형식)
 * @param phoneNumber 원시 전화번호 문자열
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '');

  // 전화번호 길이에 따라 포맷팅
  if (cleaned.length === 11) {
    // 휴대폰 번호 (010-1234-5678)
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // 일반 전화번호 (02-123-4567 또는 010-123-4567)
    if (cleaned.startsWith('02')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
  } else if (cleaned.length === 9) {
    // 지역 전화번호 (02-123-4567)
    if (cleaned.startsWith('02')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    }
  }

  // 위 규칙에 맞지 않으면 원래 값 반환
  return phoneNumber;
}

/**
 * 이메일 주소 마스킹 (예: a***@example.com)
 * @param email 이메일 주소
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [username, domain] = email.split('@');

  // 사용자 이름이 짧은 경우 처리
  if (username.length <= 1) {
    return `${username}***@${domain}`;
  }

  // 첫 글자만 표시하고 나머지는 별표로 마스킹
  const firstChar = username.charAt(0);
  const maskedUsername = `${firstChar}${'*'.repeat(username.length - 1)}`;

  return `${maskedUsername}@${domain}`;
}

/**
 * 이름 마스킹 (예: 홍*동, 스*브 존*)
 * @param name 이름
 */
export function maskName(name: string): string {
  if (!name || name.length <= 1) return name;

  // 한글 이름 (보통 2~4자)
  if (/^[가-힣]+$/.test(name)) {
    if (name.length === 2) {
      return name.charAt(0) + '*';
    } else {
      return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    }
  }
  // 영문 이름 (이름 성)
  else if (/^[A-Za-z]+(?: [A-Za-z]+)?$/.test(name)) {
    const nameParts = name.split(' ');

    // 성과 이름이 분리된 경우
    if (nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastName = nameParts[1];

      const maskedFirstName = firstName.charAt(0) + '*'.repeat(firstName.length - 1);
      const maskedLastName = lastName.charAt(0) + '*'.repeat(lastName.length - 1);

      return `${maskedFirstName} ${maskedLastName}`;
    }
    // 단일 이름
    else {
      const firstName = nameParts[0];
      return firstName.charAt(0) + '*'.repeat(firstName.length - 1);
    }
  }

  // 기타 형식
  return name.charAt(0) + '*'.repeat(name.length - 1);
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 포맷팅
 * @param bytes 바이트 단위 크기
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 주소 포맷팅 (도로명 주소 또는 지번 주소)
 * @param address 전체 주소
 * @param limit 최대 길이 (초과 시 '...'로 표시)
 */
export function formatAddress(address: string, limit?: number): string {
  if (!address) return '';

  // 특수 문자 및 공백 정리
  let formattedAddress = address.trim().replace(/\s+/g, ' ');

  // 주소 일부만 표시
  if (limit && formattedAddress.length > limit) {
    formattedAddress = formattedAddress.substring(0, limit) + '...';
  }

  return formattedAddress;
}

/**
 * 상점 등급을 별표로 표시
 * @param rating 평점 (1-5)
 * @param maxRating 최대 평점 (기본값: 5)
 */
export function formatRatingStars(rating: number, maxRating: number = 5): string {
  // 유효한 범위로 조정
  const normalizedRating = Math.max(0, Math.min(rating, maxRating));

  // 별 개수 계산
  const fullStars = Math.floor(normalizedRating);
  const halfStar = normalizedRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxRating - fullStars - halfStar;

  // 별 표시 생성
  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '　'.repeat(emptyStars);
}

/**
 * URL을 표시용으로 포맷팅 (프로토콜 제거)
 * @param url 원본 URL
 */
export function formatDisplayUrl(url: string): string {
  if (!url) return '';

  // 프로토콜 제거
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

/**
 * 텍스트 문자열 자르기 (말줄임표 처리)
 * @param text 원본 텍스트
 * @param maxLength 최대 길이
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
}

export default {
  formatCurrency,
  formatNumber,
  formatPhoneNumber,
  maskEmail,
  maskName,
  formatFileSize,
  formatAddress,
  formatRatingStars,
  formatDisplayUrl,
  truncateText,
};
