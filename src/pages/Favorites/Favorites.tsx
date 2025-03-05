import { Link } from 'react-router-dom';

const Favorites = () => {
  // 즐겨찾기 목록을 위한 더미 데이터
  const dummyFavorites = [
    { id: 1, name: '커피샵 A', category: '카페', image: 'https://placehold.co/600x400' },
    { id: 2, name: '레스토랑 B', category: '식당', image: 'https://placehold.co/600x400' },
    { id: 3, name: '서점 C', category: '서점', image: 'https://placehold.co/600x400' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">내 즐겨찾기</h1>

      {dummyFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyFavorites.map((shop) => (
            <div
              key={shop.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 mb-2">
                  {shop.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/shops/${shop.id}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    자세히 보기
                  </Link>
                  <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">아직 즐겨찾기한 장소가 없습니다.</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            장소 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
