import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const authContext = useContext(AuthContext);

  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }

  const { username, name } = authContext;

  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'stories') {
      const fetchStories = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://localhost:3000/api/stories/author/${username}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authContext.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch stories');
          }
          const data = await response.json();
          setStories(data.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStories();
    }
  }, [activeTab, username]);

  const user = {
    name: name,
    username: username,
    followers: 1000000000000,
    bio: 'A passionate programmer and tech enthusiast.',
    following: ['sanzida', 'sumonta', 'sajib'],
  };

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-300 dark:bg-gray-600'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>
      <div className='flex flex-1 w-full overflow-y-auto'>
        <main className='flex-1 p-6'>
          {/* style={{ maxHeight: 'calc(100vh - 80px)' }} */}
          <div className='flex pb-2 mb-4 space-x-6 border-b-4 border-gray-400 dark:border-gray-200'>
            {['stories', 'liked', 'bookmarked'].map(tab => (
              <button
                key={tab}
                className={`text-lg font-semibold pb-2 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'dark:text-white'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'stories' && (
              <div>
                {loading ? (
                  <p>Loading stories...</p>
                ) : error ? (
                  <p className='text-red-500'>{error}</p>
                ) : stories.length > 0 ? (
                  // <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  stories.map((story: any) => (
                    <div key={story.id} className='mb-4'>
                      <BlogCard story={story} />
                    </div>
                  ))
                ) : (
                  // </div>
                  <p>No stories available.</p>
                )}
              </div>
            )}
            {activeTab === 'drafts' && <p>List of user drafts...</p>}
            {activeTab === 'liked' && <p>List of liked stories...</p>}
            {activeTab === 'bookmarked' && <p>List of bookmarked stories...</p>}
          </div>
        </main>

        <ProfileCard user={user} />
      </div>
    </div>
  );
};

export default Profile;
