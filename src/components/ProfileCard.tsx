const ProfileCard = ({ user }: { user: any }) => {
  return (
    <aside className='w-1/4 bg-cyan-50 p-6 border-r border-gray-300'>
      <div className='mb-6 p-4 bg-gray-200 rounded-lg text-center'>
        <div className='w-20 h-20 bg-gray-400 rounded-full mx-auto mb-3'></div>
        <h2 className='text-lg font-bold'>{user.name}</h2>
        <p className='text-gray-600'>{user.username}</p>
        <p className='mt-2 text-sm text-gray-500'>{user.followers} Followers</p>
      </div>

      <div className='mb-4'>
        <p className='text-gray-700'>{user.bio}</p>
      </div>

      <button className='w-full py-2 bg-blue-500 text-white rounded-md mb-4'>
        Edit Profile
      </button>

      <h3 className='text-lg font-semibold mb-2'>Following</h3>
      <ul>
        {user.following.map((person: string, index: number) => (
          <li key={index} className='text-gray-700 py-1'>
            {person}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ProfileCard;
