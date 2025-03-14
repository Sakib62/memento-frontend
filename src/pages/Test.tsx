import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Test = () => {
  const [selectedTab, setSelectedTab] = useState('created');

  const [likedStories, setLikedStories] = useState([]);
  const authContext = useContext(AuthContext);

  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }

  const { username, name } = authContext;

  useEffect(() => {
    const fetchLikedStories = async () => {
      if (selectedTab === 'liked') {
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
          const data = await response.json();
          setLikedStories(data.data);
          console.log(data.data)
        } catch (error) {
          console.error('Error fetching liked stories:', error);
        }
      }
    };
  
    fetchLikedStories();
  }, [selectedTab]);
  
  // More dummy data for stories
  const stories = {
    created: [
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
      { id: 1, title: 'Story 1', description: 'This is the first story' },
      { id: 2, title: 'Story 2', description: 'This is the second story' },
      { id: 3, title: 'Story 3', description: 'This is the third story' },
    ],
    liked: likedStories,
    commented: [
      { id: 1, title: 'Commented Story 1', description: 'A commented story' },
      {
        id: 2,
        title: 'Commented Story 2',
        description: 'Another commented story',
      },
      {
        id: 3,
        title: 'Commented Story 3',
        description: 'Yet another commented story',
      },
    ],
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>

      {/* Left Panel - User Stories */}
      <div className='flex min-h-screen bg-red-400'>
        <div
          className='w-2/3 p-4 overflow-auto'
          style={{ maxHeight: 'calc(100vh - 32px)' }}
        >
          {/* Tabs */}
          <div className='flex mb-4 space-x-4'>
            <button
              className={`py-2 px-4 rounded ${
                selectedTab === 'created'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setSelectedTab('created')}
            >
              Created
            </button>
            <button
              className={`py-2 px-4 rounded ${
                selectedTab === 'liked'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setSelectedTab('liked')}
            >
              Liked
            </button>
            <button
              className={`py-2 px-4 rounded ${
                selectedTab === 'commented'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setSelectedTab('commented')}
            >
              Commented
            </button>
          </div>

          {/* Story Cards */}
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {stories[selectedTab].map(story => (
              <div
                key={story.id}
                className='p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg'
              >
                <h3 className='mb-2 text-xl font-semibold'>{story.title}</h3>
                <p className='text-gray-700'>{story.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - User Info */}
        <div
          className='w-1/3 min-h-screen p-4 overflow-auto bg-gray-500'
          style={{ maxHeight: 'calc(100vh - 32px)' }}
        >
          <div className='flex flex-col items-center'>
            {/* User Image */}
            <img
              src='https://via.placeholder.com/150'
              alt='User Avatar'
              className='w-24 h-24 mb-4 rounded-full'
            />

            {/* User Info */}
            <h2 className='text-xl font-semibold'>Username</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>
            <h2 className='text-xl font-semibold'>Username</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>
            <h2 className='text-xl font-semibold'>Username</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>
            <h2 className='text-xl font-semibold'>Username</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>
            <h2 className='text-xl font-semibold'>Username</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>

            {/* Profile Update Buttons */}
            <div className='space-x-4'>
              <button className='px-4 py-2 text-white bg-blue-500 rounded'>
                Update Profile
              </button>
              <button className='px-4 py-2 text-gray-700 bg-gray-200 rounded'>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Test;
