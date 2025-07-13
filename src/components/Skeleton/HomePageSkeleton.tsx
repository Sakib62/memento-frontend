const HomePageSkeleton = () => {
  const latestStoriesHeight = 'h-[500px]';
  const topLikedStoriesHeight = 'h-[400px]';

  return (
    <div className='min-h-screen px-8 py-8 bg-stone-100 dark:bg-stone-800'>
      <div className='p-10 mb-8 text-center rounded-lg shadow bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:from-blue-900 dark:via-stone-800 dark:to-blue-900'>
        <div className='w-3/4 h-10 mx-auto mb-4 bg-gray-300 rounded dark:bg-stone-600 animate-pulse'></div>
        <div className='w-1/2 h-6 mx-auto mb-6 bg-gray-300 rounded dark:bg-stone-600 animate-pulse'></div>
        <div className='w-40 h-12 mx-auto bg-gray-300 rounded dark:bg-stone-600 animate-pulse'></div>
      </div>

      <div className='mx-auto max-w-7xl'>
        <div className='mb-8'>
          <div className='mb-6 text-center'>
            <div className='w-48 h-8 mx-auto bg-gray-300 rounded dark:bg-stone-600 animate-pulse'></div>
          </div>
          <div
            className={`${latestStoriesHeight} bg-gray-200 dark:bg-stone-700 rounded animate-pulse`}
          ></div>
        </div>

        <div className='mb-8'>
          <div className='mb-6 text-center'>
            <div className='w-48 h-8 mx-auto bg-gray-300 rounded dark:bg-stone-600 animate-pulse'></div>
          </div>
          <div
            className={`${topLikedStoriesHeight} bg-gray-200 dark:bg-stone-700 rounded animate-pulse`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;
