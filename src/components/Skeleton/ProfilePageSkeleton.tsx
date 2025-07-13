import SkeletonProfileHeader from '../Skeleton/SkeletonProfileHeader';
import SkeletonStoryCard from '../Skeleton/SkeletonStoryCard';

const ProfilePageSkeleton = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <SkeletonProfileHeader />
      {/* Stories grid skeleton */}
      <div className='flex-grow bg-gray-100'>
        <div className='grid grid-cols-1 gap-8 p-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonStoryCard key={`skeleton-${i}`} isForProfile={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
