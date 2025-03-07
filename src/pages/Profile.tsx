import { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const authContext = useContext(AuthContext);

  // If context is undefined, return an error or a fallback UI
  if (!authContext) {
    return <div>Loading...</div>; // or a fallback message
  }

  const { username, name, role } = authContext;

  const [activeTab, setActiveTab] = useState('stories');

  const user = {
    name: name,
    username: username,
    followers: 1000000000000,
    bio: 'A passionate programmer and tech enthusiast.',
    following: ['sanzida', 'sumonta', 'sajib'],
  };

  return (
    <div className='flex flex-col items-center  bg-gray-100 min-h-screen'>
      <Navbar />
      <div className='flex flex-1 w-full bg-cyan-200'>
        <ProfileCard user={user} />

        <main className='flex-1 p-6'>
          <div className='flex space-x-6 border-b pb-2 mb-4'>
            {['stories', 'drafts', 'liked', 'bookmarked'].map(tab => (
              <button
                key={tab}
                className={`pb-2 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'stories' && <p>List of user stories...</p>}
            {activeTab === 'drafts' && <p>List of user drafts...</p>}
            {activeTab === 'liked' && <p>List of liked stories...</p>}
            {activeTab === 'bookmarked' && <p>List of bookmarked stories...</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
