import React from 'react';
import SkeletonStoryCard from './SkeletonStoryCard';

const SkeletonProfileStories: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-6 pb-4 rounded-lg md:grid-cols-2'>
      {/* Show 4 skeleton story cards */}
      {[...Array(4)].map((_, index) => (
        <div className='py-0' key={index}>
          <SkeletonStoryCard />
        </div>
      ))}
    </div>
  );
};

export default SkeletonProfileStories;
