import React from 'react';

const SkeletonStoryCard: React.FC = () => {
  return (
    <div className='flex items-stretch gap-4 p-4 shadow-md bg-amber-100 rounded-xl dark:bg-stone-800 animate-pulse'>
      {/* Left Section: Text Content */}
      <div className='flex flex-col justify-between flex-1'>
        <div>
          {/* Title Placeholder */}
          <div className='w-3/4 h-8 bg-gray-300 rounded dark:bg-stone-600'></div>
          {/* Description Placeholder */}
          <div className='mt-3 min-h-[48px]'>
            <div className='w-full h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-5/6 h-4 mt-2 bg-gray-200 rounded dark:bg-stone-700'></div>
          </div>
        </div>
        {/* Meta Info Placeholder */}
        <div className='flex items-center justify-between mt-6'>
          {/* Author Name Placeholder */}
          <div className='w-1/4 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          {/* Date, Likes, Comments Placeholder */}
          <div className='flex items-center gap-4'>
            <div className='w-16 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          </div>
        </div>
      </div>
      {/* Right Section: Banner Placeholder */}
      {/* <div className='flex-shrink-0 w-48 h-48 bg-gray-300 rounded-lg dark:bg-stone-600'></div> */}
    </div>
  );
};

export default SkeletonStoryCard;
