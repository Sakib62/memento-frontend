const SkeletonProfileHeader = () => {
  return (
    <div className='p-0'>
      <div className='flex flex-col h-auto bg-[#f0f8ff] rounded-md rounded-b-none md:flex-row animate-pulse'>
        <div className='w-full p-4 space-y-4 md:w-1/2'>
          <div className='w-2/5 h-12 bg-gray-300 rounded-md'></div>
          <div className='w-1/2 h-8 bg-gray-300 rounded-md'></div>
          <div className='w-3/5 h-8 bg-gray-300 rounded-md'></div>
        </div>
        <div className='flex items-center justify-center w-full py-4 pr-8 space-x-8 md:justify-end md:w-1/2'>
          <div className='w-2/12 h-12 bg-gray-300 rounded-md md:h-20'></div>
          <div className='w-2/12 h-12 bg-gray-300 rounded-md md:h-20'></div>
          <div className='w-2/12 h-12 bg-gray-300 rounded-md md:h-20'></div>
        </div>
      </div>

      <div className='flex h-10 gap-4 py-2 pl-4 bg-[#dcf3ff] rounded-md rounded-t-none'>
        <div className='w-16 h-6 bg-gray-300 rounded-md'></div>
        <div className='w-20 h-6 bg-gray-300 rounded-md'></div>
        <div className='w-16 h-6 bg-gray-300 rounded-md'></div>
      </div>
    </div>
  );
};

export default SkeletonProfileHeader;
