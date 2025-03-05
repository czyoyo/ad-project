const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        회사 소개
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">우리의 비전</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          우리는 로컬 비즈니스와 고객을 연결하는 혁신적인 플랫폼을 통해 지역 경제를 활성화하고자
          합니다. 다양한 지역 상점과 서비스를 손쉽게 발견하고 이용할 수 있도록 도와드립니다.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          2023년에 설립된 이후, 우리는 꾸준히 성장하여 현재 전국 각지의 수천 개 비즈니스와 협력하고
          있으며, 매일 더 많은 이용자들에게 가치 있는 서비스를 제공하고 있습니다.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">핵심 가치</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-purple-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              <strong>신뢰성</strong> - 정확하고 신뢰할 수 있는 정보를 제공합니다.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-purple-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              <strong>지역 커뮤니티</strong> - 지역 경제와 커뮤니티를 지원합니다.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-purple-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              <strong>혁신</strong> - 지속적으로 서비스를 개선하고 혁신합니다.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-purple-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              <strong>다양성</strong> - 모든 종류의 비즈니스와 사용자를 환영합니다.
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">팀 소개</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="h-32 w-32 mx-auto rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-300">KH</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">김현우</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">CEO & 공동 창업자</p>
          </div>
          <div>
            <div className="h-32 w-32 mx-auto rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-300">LJ</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">이지현</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">CTO & 공동 창업자</p>
          </div>
          <div>
            <div className="h-32 w-32 mx-auto rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-300">PS</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">박성민</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">디자인 책임자</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
