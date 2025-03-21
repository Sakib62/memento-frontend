import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import StoryCard from '../components/StoryCard';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const { username: paramUsername } = useParams();

  const { id, username: loggedInUsername, token } = authContext;

  type UserInfo = {
    id: string;
    username: string;
    email: string;
    name: string;
    joinDate: Date;
    role: number;
  };

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const fetchUserInfo = async (username: string) => {
    if (!username) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/username/${username}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }
      const data = await response.json();
      setUserInfo(data.data);
    } catch (err) {
      console.log('Error fetching user information');
    }
  };

  useEffect(() => {
    const usernameToFetch = paramUsername || loggedInUsername;

    if (typeof usernameToFetch === 'string') {
      fetchUserInfo(usernameToFetch);
    }
  }, [paramUsername, loggedInUsername, token]);

  type TabType = 'created' | 'liked' | 'commented';
  const [selectedTab, setSelectedTab] = useState<TabType>('created');

  const [likedStories, setLikedStories] = useState([]);
  const [createdStories, setCreatedStories] = useState([]);
  const [commentedStories, setCommentedStories] = useState([]);

  const tabs = ['created', 'liked', 'commented'];
  const fetchStoriesByTab = async () => {
    try {
      const tabEndpoints: Record<string, string> = {
        created: `http://localhost:3000/api/stories/author/${paramUsername}`,
        liked: `http://localhost:3000/api/users/${userInfo.id}/stories/liked`,
        commented: `http://localhost:3000/api/users/${userInfo.id}/stories/commented`,
      };

      const endpoint = tabEndpoints[selectedTab];
      if (!endpoint) return;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      switch (selectedTab) {
        case 'created':
          setCreatedStories(data.data);
          break;
        case 'liked':
          setLikedStories(data.data);
          break;
        case 'commented':
          setCommentedStories(data.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${selectedTab} stories:`, error);
    }
  };

  useEffect(() => {
    fetchStoriesByTab();
  }, [selectedTab, paramUsername]);

  type Story = {
    id: string;
    title: string;
    description: string;
    authorUsername: string;
    authorName: string;
    createdAt: Date;
    tags: string[];
    updatedAt?: Date;
  };

  const stories: Record<TabType, Story[]> = {
    created: createdStories,
    liked: likedStories,
    commented: commentedStories,
  };

  const handleDeleteAccount = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        authContext.clearAuthData();
      } catch (error) {
        console.error('Error deleting account:', error);
        Swal.fire(
          'Error!',
          'An error occurred while deleting the user.',
          'error'
        );
      }
    } else {
      console.log('Account deletion canceled');
    }
  };

  const [showPopup, setShowPopup] = useState(false);
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

  const [updatedName, setUpdatedName] = useState(userInfo.name || '');
  const [updatedEmail, setUpdatedEmail] = useState(userInfo.email || '');

  useEffect(() => {
    setUpdatedName(userInfo.name || '');
    setUpdatedEmail(userInfo.email || '');
  }, [userInfo]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userInfo.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authContext.token}`,
          },
          body: JSON.stringify({
            name: updatedName,
            email: updatedEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setShowPopup(false);
      fetchUserInfo();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
<div className='flex min-h-screen bg-stone-700'>
  {/* Left Sidebar - User Info */}
  <div
    className='w-1/4 min-h-screen p-4 overflow-auto bg-gray-200 rounded-lg shadow-lg'
    style={{ maxHeight: 'calc(100vh - 32px)' }}
  >
    <div className='flex flex-col items-center mt-12'>
      <h2 className='mb-1 text-xl font-semibold'>{userInfo.name}</h2>
      <p className='mb-4 text-center text-gray-600'>@{userInfo.username}</p>

      <div className='flex flex-col items-start gap-2 mt-6 mb-6 text-gray-500 text-md'>
        <p>
          <span className='font-semibold text-gray-700 dark:text-black'>
            Role:
          </span>{' '}
          {userInfo.role === 1 ? 'Admin' : 'User'}
        </p>
        <p>
          <span className='font-semibold text-gray-700 dark:text-black'>
            Joined:
          </span>{' '}
          {new Date(userInfo.joinDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <p>
          <span className='font-semibold text-gray-700 dark:text-black'>
            Email:
          </span>{' '}
          {userInfo.email}
        </p>
      </div>

      <div className='flex flex-col justify-center gap-4 mt-6'>
        {/* Buttons for Update, Reset, Delete Account */}
        {(userInfo.role == 1 || loggedInUsername == userInfo.username) && (
          <div className='flex flex-col gap-4'>
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
              onClick={() => handleDeleteAccount(userInfo.id)}
              className='px-4 py-2 text-white bg-red-500 rounded'
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  </div>

  <div
    className='w-3/4 p-4 overflow-auto custom-scroll'
    style={{ maxHeight: 'calc(100vh - 32px)' }}
  >
    <div className='flex mb-4 space-x-4'>
      {tabs.map(tab => (
        <button
          key={tab}
          className={`py-2 px-4 rounded ${
            selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-${stories[selectedTab].length === 1 ? '1' : '2'} lg:grid-cols-${stories[selectedTab].length >= 2 ? '2' : stories[selectedTab].length}`}
    >
      {stories[selectedTab].length > 0 ? (
        stories[selectedTab].map(story => (
          <StoryCard key={story.id} story={story} />
        ))
      ) : (
        <div className='flex items-center justify-center min-h-screen col-span-full'>
          <p className='font-semibold text-gray-500'>No stories yet.</p>
        </div>
      )}
    </div>
  </div>

  {showPopup && (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='p-6 bg-gray-100 rounded-lg w-96'>
        <h2 className='mb-4 text-lg font-semibold text-center'>
          Update Profile
        </h2>

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
            value={updatedName}
            onChange={e => setUpdatedName(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none'
          />
        </div>

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
            value={updatedEmail}
            onChange={e => setUpdatedEmail(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none'
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
            onClick={handleUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>


  );
};

export default Profile;
