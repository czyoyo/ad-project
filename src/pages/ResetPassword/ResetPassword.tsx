import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // 토큰이 있을 경우 토큰 검증
  useEffect(() => {
    if (token) {
      // 실제 구현에서는 백엔드 API를 호출하여 토큰 유효성 검사
      const validateToken = async () => {
        setIsLoading(true);
        try {
          // 토큰 검증 API 호출 (시뮬레이션)
          await new Promise((resolve) => setTimeout(resolve, 500));
          setIsTokenValid(true);
        } catch (err) {
          setError('유효하지 않거나 만료된 토큰입니다.');
          setIsTokenValid(false);
        } finally {
          setIsLoading(false);
        }
      };

      validateToken();
    }
  }, [token]);

  // 이메일로 비밀번호 재설정 링크 요청
  const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 비밀번호 재설정 링크 요청 API 호출 (시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
      setEmail('');
    } catch (err) {
      setError('비밀번호 재설정 링크 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 새 비밀번호 설정
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 비밀번호 재설정 API 호출 (시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {token ? '새 비밀번호 설정' : '비밀번호 재설정'}
      </h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      {!token ? (
        // 비밀번호 재설정 링크 요청 폼
        <form onSubmit={handleRequestReset} className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            등록된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </p>

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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '처리 중...' : '재설정 링크 전송'}
          </Button>
        </form>
      ) : // 새 비밀번호 설정 폼 (토큰이 있을 경우)
      isLoading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : isTokenValid ? (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              새 비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '처리 중...' : '비밀번호 변경'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8 text-red-600">
          유효하지 않은 또는 만료된 링크입니다. 다시 요청해주세요.
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
