const SkeletonStoryView = () => {
  return (
    <div className='py-6 bg-gray-100 dark:bg-neutral-800'>
      <div className='flex flex-col max-w-2xl gap-4 p-8 pt-4 mx-auto bg-white rounded-lg dark:bg-stone-700 animate-pulse'>
        <div className='w-full bg-gray-300 rounded-md h-14 dark:bg-gray-600'></div>

        <div className='flex gap-2'>
          <div className='w-16 h-6 bg-gray-300 rounded-full dark:bg-gray-600'></div>
          <div className='w-12 h-6 bg-gray-300 rounded-full dark:bg-gray-600'></div>
          <div className='w-24 h-6 bg-gray-300 rounded-full dark:bg-gray-600'></div>
        </div>

        <div className='w-1/4 h-10 mt-2 bg-gray-300 rounded-md dark:bg-gray-600'></div>

        <div className='w-full h-64 mt-4 bg-gray-200 rounded-md dark:bg-gray-600'></div>
      </div>
    </div>
  );
};

export default SkeletonStoryView;
