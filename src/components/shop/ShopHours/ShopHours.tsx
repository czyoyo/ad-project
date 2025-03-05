import React from 'react';
import { BusinessHours } from '../../types/shop.types';

interface ShopHoursProps {
  hours: BusinessHours;
}

const ShopHours: React.FC<ShopHoursProps> = ({ hours }) => {
  if (!hours || Object.keys(hours).length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">등록된 영업시간 정보가 없습니다.</div>;
  }

  // 요일 표시 순서 (일요일부터)
  const dayOrder = ['일', '월', '화', '수', '목', '금', '토'];

  // 현재 요일 확인 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const today = new Date().getDay();
  const currentDay = dayOrder[today];

  return (
    <ul className="space-y-2">
      {dayOrder.map((day) => {
        const hourInfo = hours[day];
        if (!hourInfo) return null;

        const isToday = day === currentDay;

        return (
          <li
            key={day}
            className={`flex justify-between items-center py-1 ${
              isToday
                ? 'font-medium text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <span className="w-8">{day}</span>
            {hourInfo.isClosed ? (
              <span className="text-red-500 dark:text-red-400">휴무일</span>
            ) : (
              <span>
                {hourInfo.open} - {hourInfo.close}
              </span>
            )}
            {isToday && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded ml-2">
                오늘
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ShopHours;
