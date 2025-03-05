import { ChangeEvent, FormEvent, JSX, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Button from '../../components/ui/Button/Button';
import { isValidEmail, isValidPassword, passwordStrength } from '../../utils/validation';

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
    form: '',
  });

  // 입력 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 비밀번호 강도 표시
  const getPasswordStrengthText = () => {
    if (!formData.password) return '';

    const strength = passwordStrength(formData.password);

    switch (strength) {
      case 1:
        return '매우 약함';
      case 2:
        return '약함';
      case 3:
        return '보통';
      case 4:
        return '강함';
      case 5:
        return '매우 강함';
      default:
        return '';
    }
  };

  // 비밀번호 강도에 따른 색상
  const getPasswordStrengthColor = () => {
    if (!formData.password) return 'bg-gray-200 dark:bg-gray-700';

    const strength = passwordStrength(formData.password);

    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-600';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      acceptTerms: '',
      form: '',
    };

    let isValid = true;

    // 이메일 검사
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
      isValid = false;
    }

    // 사용자명 검사
    if (!formData.nickname) {
      newErrors.nickname = '사용자 닉네임을 입력해주세요.';
      isValid = false;
    } else if (formData.nickname.length < 3) {
      newErrors.nickname = '닉네임은 3자 이상이어야 합니다.';
      isValid = false;
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.';
      isValid = false;
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    // 이용약관 동의 검사
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = '이용약관에 동의해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const success = await register({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
      });

      if (success) {
        navigate('/');
      }
    } catch (err) {
      setErrors({
        ...errors,
        form: '회원가입에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        회원가입
      </h1>

      {/* 에러 메시지 */}
      {(error || errors.form) && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
          {error || errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이메일 입력 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* 사용자명 입력 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            사용자명
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.nickname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="nickname"
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nickname}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="••••••••"
          />
          {formData.password && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength(formData.password) * 20}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                비밀번호 강도: {getPasswordStrengthText()}
              </p>
            </div>
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* 비밀번호 확인 입력 */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 이용약관 동의 */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
                <Link
                  to="/terms-of-service"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  이용약관
                </Link>{' '}
                및{' '}
                <Link
                  to="/privacy-policy"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
              )}
            </div>
          </div>
        </div>

        {/* 마케팅 정보 수신 동의 */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptMarketing"
                name="acceptMarketing"
                type="checkbox"
                checked={formData.acceptMarketing}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptMarketing" className="text-gray-700 dark:text-gray-300">
                이벤트, 프로모션 및 마케팅 정보 수신에 동의합니다. (선택)
              </label>
            </div>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div>
          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>
        </div>
      </form>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
