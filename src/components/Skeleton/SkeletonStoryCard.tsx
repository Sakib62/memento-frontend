const SkeletonStoryCard = ({
  isForProfile = false,
}: {
  isForProfile?: boolean;
}) => {
  return (
    <div className='flex items-stretch gap-4 p-4 bg-white rounded-lg shadow-lg dark:bg-stone-800 animate-pulse min-h-[200px]'>
      <div className='flex flex-col justify-between flex-1 '>
        <div>
          {!isForProfile && (
            <div className='w-1/3 h-6 mb-2 bg-gray-200 rounded'></div>
          )}
          <div className='w-3/4 h-8 bg-gray-300 rounded dark:bg-stone-600'></div>
          <div className='mt-3 min-h-[40px]'>
            <div className='w-full h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
            <div className='w-5/6 h-4 mt-2 bg-gray-200 rounded dark:bg-stone-700'></div>
          </div>
        </div>
        <div className='flex gap-4 mt-6 min-h-[24px]'>
          <div className='w-16 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
          <div className='w-8 h-4 bg-gray-200 rounded dark:bg-stone-700'></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonStoryCard;
