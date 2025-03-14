const ProfileCard = ({ user }: { user: any }) => {
  return (
    <aside className='w-full p-6 border border-gray-200 rounded-lg shadow-lg sm:w-1/3 lg:w-1/4 bg-cyan-50 dark:bg-gray-300'>
      <div className='mb-6 text-center'>
        <div className='w-24 h-24 mx-auto mb-3 bg-yellow-400 rounded-full'>
          {/* Placeholder for Avatar */}
        </div>
        <h2 className='text-2xl font-semibold'>{user.name}</h2>
        {/* <p className='text-lg text-gray-600'>{user.username}</p> */}
        <p className='mt-2 text-sm text-gray-500'>{user.followers} Followers</p>
      </div>

      <div className='mb-6'>
        <p className='text-base text-gray-700'>{user.bio}</p>
      </div>

      {/* <button className='w-full py-2 mb-4 font-semibold text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700'>
        Edit Profile
      </button> */}

      <div>
        <h3 className='mb-3 text-lg font-semibold text-gray-800'>Following</h3>
        <ul>
          {user.following.map((person: string, index: number) => (
            <li
              key={index}
              className='py-1 text-gray-700 transition duration-200 hover:text-blue-500'
            >
              {person}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ProfileCard;
