import React from 'react';

interface ShopFeaturesListProps {
  features: {
    name: string;
    value: string | boolean;
    icon?: string;
  }[];
}

const ShopFeaturesList: React.FC<ShopFeaturesListProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">등록된 매장 특징이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {feature.icon ? (
            <span className="mr-3 text-purple-500">{feature.icon}</span>
          ) : (
            <svg
              className="w-5 h-5 mr-3 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          <div>
            <span className="font-medium text-gray-800 dark:text-white">{feature.name}</span>
            {typeof feature.value === 'string' && (
              <span className="ml-2 text-gray-600 dark:text-gray-300">{feature.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopFeaturesList;
