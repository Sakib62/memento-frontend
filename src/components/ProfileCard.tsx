interface User {
  username: string;
  bio: string;
  profileImage: string; // URL to the user's profile image
}


const ProfileCard = ({ user }: { user: any }) => {
  return (
    <div className="flex-col items-center w-full max-w-xs p-6 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {/* Profile Image */}
      <img
        src={user.profileImage}
        alt="Profile"
        className="w-32 h-32 mb-4 border-4 border-blue-500 rounded-full dark:border-gray-600"
      />
      
      {/* Username */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.username}</h2>
      
      {/* Bio */}
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">{user.bio}</p>

      {/* Buttons */}
      <div className="w-full mt-16 space-y-6">
        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-800 dark:hover:bg-blue-700">
          Update Profile
        </button>
        <button className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-green-800 dark:hover:bg-green-700">
          Reset Password
        </button>
        <button className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-red-800 dark:hover:bg-red-700">
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
