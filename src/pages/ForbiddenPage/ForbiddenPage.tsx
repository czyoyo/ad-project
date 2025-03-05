import { Link } from 'react-router-dom';

function ForbiddenPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-red-500 mb-6">403</h1>
      <h2 className="text-3xl font-semibold mb-4">접근 권한이 없습니다</h2>
      <p className="text-lg text-gray-600 mb-8">
        이 페이지에 접근할 수 있는 권한이 없습니다. 관리자 권한이 필요합니다.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default ForbiddenPage;
