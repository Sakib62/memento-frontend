const SettingsPageSkeleton = () => {
  return (
    <div className='flex justify-center min-h-screen pt-0 pb-16 bg-gray-100'>
      <div className='w-full max-w-3xl p-8 bg-white rounded-md shadow-xl animate-pulse'>
        {/* Profile Update Section */}
        <div className='mb-8 space-y-4'>
          <div className='w-1/3 bg-gray-200 rounded h-7'></div>
          <div className='w-3/4 h-10 bg-gray-200 rounded'></div>
          <div className='w-3/4 h-10 bg-gray-200 rounded'></div>
          <div className='w-1/4 h-10 bg-gray-200 rounded'></div>
        </div>

        {/* Divider */}
        <div className='h-2 my-6 bg-gray-200 rounded'></div>

        {/* Password Reset Section */}
        <div className='mb-8 space-y-4'>
          <div className='w-1/3 bg-gray-200 rounded h-7'></div>
          <div className='w-3/4 h-10 bg-gray-200 rounded'></div>
          <div className='w-3/4 h-10 bg-gray-200 rounded'></div>
          <div className='w-3/4 h-10 bg-gray-200 rounded'></div>
          <div className='w-1/4 h-10 bg-gray-200 rounded'></div>
        </div>

        {/* Divider */}
        <div className='h-2 my-6 bg-gray-200 rounded'></div>

        {/* Delete Account Section */}
        <div className='space-y-4'>
          <div className='w-1/3 bg-gray-200 rounded h-7'></div>
          <div className='w-full h-4 mb-1 bg-gray-200 rounded'></div>
          <div className='w-2/3 h-4 bg-gray-200 rounded'></div>
          <div className='w-1/4 h-10 mt-4 bg-gray-200 rounded'></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageSkeleton;
