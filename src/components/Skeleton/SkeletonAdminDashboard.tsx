import React from 'react';

const SkeletonAdminDashboard: React.FC = () => {
  return (
    <div className='p-3 mb-4 bg-white rounded-lg shadow-md dark:bg-stone-800 animate-pulse'>
      {/* Placeholder for the name */}
      <div className='w-3/4 h-5 bg-gray-300 rounded dark:bg-stone-600'></div>
      {/* Placeholder for the username */}
      <div className='w-1/2 h-4 mt-2 bg-gray-200 rounded dark:bg-stone-700'></div>
    </div>
  );
};

export default SkeletonAdminDashboard;
