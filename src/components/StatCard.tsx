import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-md ${bgColor} hover:scale-105 transition-transform duration-300 dark:shadow-none dark:border dark:border-stone-700`}
    >
      <div className={`text-2xl ${textColor}`}>{icon}</div>
      <div>
        <p className={`text-sm font-medium ${textColor} dark:text-gray-200`}>
          {label}
        </p>
        <p className={`text-xl font-bold ${textColor} dark:text-gray-100`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
