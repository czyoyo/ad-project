import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Button from '../../components/ui/Button/Button';
import { isValidEmail } from '../../utils/validation';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  // 리디렉션 처리 (로그인 후 이전 페이지로 돌아가기)
  const from = new URLSearchParams(location.search).get('from') || '/';

  // 입력 유효성 검사
  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      form: '',
    };

    let isValid = true;

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from);
      }
    } catch (err) {
      setErrors({
        ...errors,
        form: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">로그인</h1>

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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              비밀번호
            </label>
            <Link
              to="/reset-password"
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* 추가 옵션 */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            로그인 상태 유지
          </label>
        </div>

        {/* 로그인 버튼 */}
        <div>
          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>

      {/* 회원가입 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link
            to="/register"
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>

      {/* 소셜 로그인 (구현 예정) */}
      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              또는
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              {/* Google icon */}
      {/* </svg>
            Google로 로그인
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
