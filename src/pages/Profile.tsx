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

  const { username: loggedInUsername, token, role } = authContext;

  type UserInfo = {
    id: string;
    username: string;
    email: string;
    name: string;
    joinDate: Date;
    role: number;
  };

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUserInfo = async (username: string) => {
    if (!username) return;
    try {
      const response = await fetch(`${apiUrl}/api/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
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
    if (typeof paramUsername === 'string') {
      fetchUserInfo(paramUsername);
    }
  }, [paramUsername, token]);

  type TabType = 'created' | 'liked' | 'commented';
  const [selectedTab, setSelectedTab] = useState<TabType>('created');

  const [likedStories, setLikedStories] = useState([]);
  const [createdStories, setCreatedStories] = useState([]);
  const [commentedStories, setCommentedStories] = useState([]);

  const tabs: TabType[] = ['created', 'liked', 'commented'];
  const fetchStoriesByTab = async () => {
    try {
      const tabEndpoints: Record<string, string> = {
        created: `${apiUrl}/api/stories/author/${paramUsername}`,
        liked: `${apiUrl}/api/users/${userInfo.id}/stories/liked`,
        commented: `${apiUrl}/api/users/${userInfo.id}/stories/commented`,
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
        const response = await fetch(`${apiUrl}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      // console.log('Account deletion canceled');
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
      const response = await fetch(`${apiUrl}/api/users/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authContext.token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          email: updatedEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setShowPopup(false);
      fetchUserInfo(paramUsername as string);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <input id="current-password" class="swal2-input" placeholder="Current Password" type="password" required>
        <input id="new-password" class="swal2-input" placeholder="New Password" type="password" required>
        <input id="confirm-password" class="swal2-input" placeholder="Confirm New Password" type="password" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const currentPassword = (
          document.getElementById('current-password') as HTMLInputElement
        )?.value;
        const newPassword = (
          document.getElementById('new-password') as HTMLInputElement
        )?.value;
        const confirmPassword = (
          document.getElementById('confirm-password') as HTMLInputElement
        )?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage(
            'New Password and Confirm Password do not match'
          );
          return false;
        }

        return { currentPassword, newPassword };
      },
    });

    if (formValues) {
      const { currentPassword, newPassword } = formValues;

      try {
        const response = await fetch(
          `${apiUrl}/api/auth/${userInfo.id}/reset-Password`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authContext.token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          }
        );

        // const data = await response.json();

        if (response.ok) {
          Swal.fire(
            'Success',
            'Password has been updated successfully!',
            'success'
          );
        } else {
          Swal.fire(
            'Error',
            'Failed to update the password. Please try again.',
            'error'
          );
        }
      } catch (error) {
        Swal.fire(
          'Error',
          'An error occurred while resetting your password. Please try again.',
          'error'
        );
      }
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-stone-700'>
      <div
        className='w-1/4 min-h-screen p-4 overflow-auto bg-gray-300 rounded-lg shadow-lg dark:bg-stone-500'
        style={{ maxHeight: 'calc(100vh - 32px)' }}
      >
        <div className='flex flex-col items-center mt-28 '>
          <h2 className='mb-1 text-xl font-semibold dark:text-white'>
            {userInfo.name}
          </h2>
          <p className='mb-4 text-center text-gray-600 dark:text-gray-200'>
            @{userInfo.username}
          </p>

          <div className='flex flex-col items-start gap-2 mt-12 mb-6 text-gray-500 text-md'>
            <p className=' dark:text-gray-200'>
              <span className='mr-2 font-semibold text-gray-700 dark:text-white'>
                Role:
              </span>{' '}
              {userInfo.role === 1 ? 'Admin' : 'User'}
            </p>
            <p className='dark:text-gray-200'>
              <span className='mr-2 font-semibold text-gray-700 dark:text-white'>
                Joined:
              </span>{' '}
              {new Date(userInfo.joinDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className='dark:text-gray-200'>
              <span className='mr-2 font-semibold text-gray-700 dark:text-white'>
                Email:
              </span>{' '}
              {userInfo.email}
            </p>
          </div>

          <div className='flex justify-between gap-6 mt-6 mb-6 font-bold'>
            <div className='flex flex-col items-center'>
              <p className='text-sm text-gray-800 dark:text-gray-200'>
                Created
              </p>
              <p className='text-lg font-semibold text-blue-500 dark:text-blue-300'>
                {createdStories.length}
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='text-sm text-gray-800 dark:text-gray-200'>Liked</p>
              <p className='text-lg font-semibold text-green-500 dark:text-green-300'>
                {likedStories.length}
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='text-sm text-gray-800 dark:text-gray-200'>
                Commented
              </p>
              <p className='text-lg font-semibold text-purple-500 dark:text-purple-300'>
                {commentedStories.length}
              </p>
            </div>
          </div>

          <div className='flex flex-col justify-center gap-4 mt-12'>
            {(role === 1 || loggedInUsername === paramUsername) && (
              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => setShowPopup(true)}
                  className='px-4 py-2 text-white bg-blue-500 rounded'
                >
                  Update Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className='px-4 py-2 text-white bg-blue-500 rounded'
                >
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
