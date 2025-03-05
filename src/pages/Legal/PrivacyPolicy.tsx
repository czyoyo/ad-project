const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">개인정보처리방침</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-4">마지막 업데이트: 2023년 6월 15일</p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          1. 개인정보의 수집 및 이용 목적
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
          <li>서비스 제공 및 계정 관리</li>
          <li>고객 지원 및 문의 응대</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
          <li>마케팅 및 프로모션 (동의한 경우에 한함)</li>
          <li>법적 의무 이행 및 분쟁 해결</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          2. 수집하는 개인정보 항목
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
          <li>필수 정보: 이메일 주소, 비밀번호, 닉네임</li>
          <li>선택 정보: 프로필 이미지, 마케팅 수신 동의 여부</li>
          <li>자동 수집 정보: IP 주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          3. 개인정보의 보유 및 이용 기간
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이
          파기합니다. 다만, 관계법령에 의해 보존할 필요가 있는 경우 법령에서 정한 기간 동안
          개인정보를 보관합니다.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          4. 개인정보의 제3자 제공
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는
          예외로 합니다:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
          <li>이용자가 사전에 동의한 경우</li>
          <li>
            법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 요청이 있는
            경우
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          5. 이용자 권리와 행사 방법
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며, 개인정보 처리에 대한
          동의를 철회할 수 있습니다. 이러한 권리는 서비스 내 '프로필' 메뉴 또는 고객센터를 통해
          행사할 수 있습니다.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
          6. 개인정보 보호책임자
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          회사는 개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자를 지정하고 있습니다:
        </p>
        <div className="mt-2 mb-4 text-gray-700 dark:text-gray-300">
          <p>이름: 김개인</p>
          <p>직위: 개인정보보호팀장</p>
          <p>연락처: privacy@example.com</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        본 개인정보처리방침은 2023년 6월 15일부터 적용됩니다.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
