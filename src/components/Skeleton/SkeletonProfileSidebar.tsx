import React from 'react';

// Skeleton version of InfoSection
const SkeletonInfoSection: React.FC = () => (
  <div className='p-3 bg-gray-300 rounded-lg shadow-md animate-pulse'>
    <div className='w-16 h-4 mb-2 bg-gray-400 rounded'></div>
    <div className='w-32 h-4 bg-gray-400 rounded'></div>
  </div>
);

const SkeletonProfileSidebar: React.FC = () => {
  return (
    <aside className='top-0 flex flex-col w-full h-full p-6 border-r shadow-lg bg-sky-400 md:max-w-[350px]'>
      <div className='flex flex-col items-center'>
        {/* Skeleton for Avatar */}
        <div className='flex items-center justify-center w-20 h-20 bg-gray-300 rounded-full animate-pulse'></div>

        {/* Skeleton for Name */}
        <div className='w-32 h-6 mt-4 bg-gray-300 rounded animate-pulse'></div>

        {/* Skeleton for Username */}
        <div className='w-24 h-4 mt-1 bg-gray-300 rounded animate-pulse'></div>
      </div>

      <div className='mt-4 space-y-4'>
        <div className='space-y-2'>
          {/* Skeleton for Info Sections */}
          <SkeletonInfoSection />
          <SkeletonInfoSection />
          <SkeletonInfoSection />
        </div>
      </div>
    </aside>
  );
};

export default SkeletonProfileSidebar;
