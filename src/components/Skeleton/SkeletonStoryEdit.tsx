const SkeletonStoryEdit = () => {
  return (
    <div className='flex flex-col gap-8 p-8 animate-pulse lg:flex-row'>
      <div className='flex flex-col gap-8 lg:w-3/4'>
        <div className='p-6 rounded-md bg-neutral-300'></div>
        <div className='h-40 rounded-md shadow-sm bg-neutral-300'></div>
      </div>
      <div className='flex flex-col h-32 rounded-md bg-neutral-300 lg:w-1/4'></div>
    </div>
  );
};

export default SkeletonStoryEdit;
