import React from 'react';

const SkeletonProfileTabs: React.FC = () => {
  return (
    <div className='flex space-x-2'>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className='w-24 h-10 bg-gray-300 rounded animate-pulse'
        />
      ))}
    </div>
  );
};

export default SkeletonProfileTabs;
