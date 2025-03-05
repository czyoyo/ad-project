import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        찾으시려는 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수 있습니다.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
