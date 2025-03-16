import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState('created');

  const [likedStories, setLikedStories] = useState([]);
  const authContext = useContext(AuthContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }

  const { id, username } = authContext;

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
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching liked stories:', error);
      }
    }
  };

  useEffect(() => {
    fetchLikedStories();
  }, [selectedTab]);

  const stories = {
    created: [
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

  const handleDelete = async () => {
    try {
      console.log(id);
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authContext.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      showToast('User deleted successfully', 'success');
      authContext.clearAuthData();
    } catch (error) {
      console.log(error);
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uname, setUname] = useState('');

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>

      {/* Left Panel - User Stories */}
      <div className='flex min-h-screen bg-gray-200'>
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
            {stories[selectedTab].length > 0 ? (
              stories[selectedTab].map(story => (
                <div
                  key={story.id}
                  className='p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg'
                >
                  <h3 className='mb-2 text-xl font-semibold'>{story.title}</h3>
                  <p className='text-gray-700'>{story.description}</p>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center min-h-screen col-span-full'>
                <p className='font-semibold text-gray-500'>No stories yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - User Info */}
        <div
          className='w-1/3 min-h-screen p-4 overflow-auto bg-gray-200'
          style={{ maxHeight: 'calc(100vh - 32px)' }}
        >
          <div className='flex flex-col items-center'>
            {/* User Image */}
            <img
              src=''
              alt='User Avatar'
              className='w-24 h-24 mb-4 border-2 border-blue-500 rounded-full'
            />

            {/* User Info */}
            <h2 className='mb-3 text-xl font-semibold'>{username}</h2>
            <p className='mb-4 text-center text-gray-600'>
              Bio goes here. A brief description of the user.
            </p>

            {/* Profile Update Buttons */}
            <div className='flex flex-col gap-4 mt-6 space-4'>
              <button
                onClick={() => setShowPopup(true)}
                className='px-4 py-2 text-white bg-blue-500 rounded'
              >
                Update Profile
              </button>
              <button className='px-4 py-2 text-white bg-blue-500 rounded'>
                Change Password
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className='px-4 py-2 text-white bg-red-500 rounded'
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Popup UI */}
        {showPopup && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='p-6 bg-gray-100 rounded-lg w-96'>
              <h2 className='mb-4 text-lg font-semibold text-center'>
                Update Profile
              </h2>

              <div className='flex flex-col items-center mb-4'>
                <img
                  src={image || 'https://via.placeholder.com/150'}
                  alt='Preview'
                  className='mb-4 border-2 border-blue-500 rounded-full h-28 w-28'
                />

                <label className='block px-4 py-2 mb-4 text-white bg-blue-500 rounded cursor-pointer w-fit'>
                  Choose Image
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
              </div>
              {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}

              {/* Name Input Section */}
              <div className='mb-4'>
                <label
                  htmlFor='name'
                  className='block mb-2 text-sm font-semibold'
                >
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='Enter your name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md'
                />
              </div>

              {/* Email Input Section */}
              <div className='mb-4'>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-semibold'
                >
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md'
                />
              </div>

              {/* Username Input Section */}
              <div className='mb-4'>
                <label
                  htmlFor='username'
                  className='block mb-2 text-sm font-semibold'
                >
                  Username
                </label>
                <input
                  id='username'
                  type='text'
                  value={uname}
                  onChange={e => setUname(e.target.value)}
                  placeholder='Enter your username'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md'
                />
              </div>

              <div className='flex justify-center gap-4 mt-6'>
                <button
                  className='px-4 py-2 text-white bg-gray-500 rounded'
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
                <button
                  className='px-4 py-2 text-white bg-blue-500 rounded'
                  onClick={() => {
                    setPreview(image);
                    setShowPopup(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='p-6 bg-white rounded-lg w-96'>
              <h2 className='mb-4 text-lg font-semibold'>
                Do you want to delete your account?
              </h2>

              <div className='flex justify-center gap-4 mt-10'>
                <button
                  onClick={() => setShowDeleteConfirm(false)} // Close modal if "No"
                  className='px-4 py-2 text-white bg-gray-500 rounded'
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleDelete(); // Delete user if "Yes"
                    setShowDeleteConfirm(false); // Close modal
                  }}
                  className='px-4 py-2 text-white bg-red-500 rounded'
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
