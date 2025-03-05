import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">내 프로필</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-purple-300">
            {user?.nickname?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.nickname || '사용자'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              프로필 수정
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">프로필 편집 폼이 여기에 표시됩니다</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
