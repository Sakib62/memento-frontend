import MarkdownIt from 'markdown-it';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {
  FaBookmark,
  FaComment,
  FaHeart,
  FaShare,
  FaUserCircle,
} from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const StoryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }
  const { username, role, token } = authContext;

  const story = location.state || {};
  const mdParser = new MarkdownIt();

  const parsedDescription = mdParser.render(story.description);

  useEffect(() => {
    if (!story) {
      navigate('/');
    }
  }, [story, navigate]);

  if (!story) {
    return null;
  }

  const { authorUsername, title } = story;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete the story');
      }
      showToast('Successfully deleted story.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting the story:', error);
      alert('There was an error deleting the story. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-600'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>

      <div className='max-w-3xl p-4 mx-auto'>
        {/* Banner */}
        <div className='w-full h-48 mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-800'></div>

        {/* Author Info */}
        <div className='flex items-center gap-4 p-4 pl-0 mb-4 rounded-lg '>
          <FaUserCircle className='text-4xl text-gray-500 dark:text-gray-400' />
          <div>
            <p className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
              {authorUsername}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Published on March 12, 2025
            </p>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className='flex items-center justify-between px-0 mb-6 text-gray-600 dark:text-gray-300'>
          <div className='flex gap-4'>
            <button className='relative flex items-center gap-1 group hover:text-red-500'>
              <FaHeart size='23' /> 11
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Like
              </span>
            </button>

            {/* Comment Button */}
            <button className='relative flex items-center gap-1 group hover:text-blue-500'>
              <FaComment size='23' /> 12
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Comment
              </span>
            </button>
          </div>

          <div className='flex gap-8'>
            {/* Share Button */}
            <button className='relative flex items-center gap-1 group hover:text-green-500'>
              <FaShare size='23' />
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Share
              </span>
            </button>

            {/* Bookmark Button */}
            <button className='relative flex items-center gap-1 group hover:text-yellow-500'>
              <FaBookmark size='23' />
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Bookmark
              </span>
            </button>

            {/* Tooltip with More Options */}
            {(authorUsername == username || role == 1) && (
              <>
                <button
                  onClick={() =>
                    navigate(`/story/${story.id}/edit`, { state: story })
                  }
                  className='relative flex items-center gap-1 group hover:scale-105'
                >
                  <MdOutlineModeEdit size='23' />
                  <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-active:opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                    Edit
                  </span>
                </button>

                <button
                  onClick={handleDeleteClick}
                  className='relative flex items-center gap-1 group hover:scale-105'
                >
                  <MdDeleteOutline size='23' />
                  <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-active:opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                    Delete
                  </span>
                </button>
              </>
            )}

            {isModalOpen && (
              <div className='fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50'>
                <div className='relative p-6 bg-white rounded-lg dark:bg-gray-700'>
                  <AiOutlineClose
                    onClick={closeModal}
                    size='24'
                    className='absolute text-gray-600 cursor-pointer dark:text-gray-300 top-2 right-2 hover:scale-110'
                  />
                  <h2 className='mb-4 text-2xl font-bold dark:text-gray-100'>
                    Delete Story
                  </h2>
                  <p className='mb-4 text-lg dark:text-gray-200'>
                    Are you sure you want to delete the story?
                  </p>
                  <div className='flex justify-between'>
                    <button
                      onClick={closeModal}
                      className='px-4 py-2 text-black bg-gray-300 rounded-md dark:text-white dark:bg-gray-500 font-lg hover:bg-gray-500 hover:scale-105'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className='px-4 py-2 text-black bg-red-500 rounded-md dark:text-white font-lg hover:bg-red-600 hover:scale-105'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100'>
          {title}
        </h1>
        <p
          className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'
          dangerouslySetInnerHTML={{ __html: parsedDescription }}
        />
      </div>
    </div>
  );
};

export default StoryDetails;
