import React from 'react';

const SkeletonStoryCard: React.FC = () => {
  return (
    <div className='flex items-stretch gap-4 p-4 bg-white shadow-md s-card rounded-xl dark:bg-stone-800 animate-pulse'>
      <div className='flex flex-col justify-between flex-1 s-content '>
        <div>
          <div className='w-3/4 h-8 bg-gray-300 rounded s-title dark:bg-stone-600'></div>
          <div className='s-description mt-3 min-h-[48px]'>
            <div className='w-full h-4 bg-gray-200 rounded s-line dark:bg-stone-700'></div>
            <div className='w-5/6 h-4 mt-2 bg-gray-200 rounded s-line dark:bg-stone-700'></div>
          </div>
        </div>
        <div className='flex items-center justify-between mt-6 s-meta'>
          <div className='w-1/4 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonStoryCard;
