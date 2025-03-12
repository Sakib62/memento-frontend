const ProfileCard = ({ user }: { user: any }) => {
  return (
    <aside className='w-full sm:w-1/3 lg:w-1/4 bg-cyan-50 p-6 rounded-lg shadow-lg border border-gray-200'>
      <div className='mb-6 text-center'>
        <div className='w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-3'>
          {/* Placeholder for Avatar */}
        </div>
        <h2 className='text-2xl font-semibold'>{user.name}</h2>
        {/* <p className='text-lg text-gray-600'>{user.username}</p> */}
        <p className='mt-2 text-sm text-gray-500'>{user.followers} Followers</p>
      </div>

      <div className='mb-6'>
        <p className='text-gray-700 text-base'>{user.bio}</p>
      </div>

      {/* <button className='w-full py-2 bg-blue-600 text-white font-semibold rounded-md transition duration-200 hover:bg-blue-700 mb-4'>
        Edit Profile
      </button> */}

      <div>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>Following</h3>
        <ul>
          {user.following.map((person: string, index: number) => (
            <li
              key={index}
              className='text-gray-700 py-1 hover:text-blue-500 transition duration-200'
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
