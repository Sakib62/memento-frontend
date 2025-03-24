import { useContext, useEffect, useState } from 'react';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MarkdownRenderer from './MarkdownRenderer';

interface Story {
  id: string;
  title: string;
  description: string;
  authorUsername: string;
  authorName: string;
  bannerUrl?: string | null;
  createdAt: Date;
}

const StoryCard = ({ story }: { story: Story }) => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const { token } = authContext;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${story.id}`, { state: story });
  };

  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const fetchLikeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}/likeStatus`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.likedByUser);
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}/commentCount`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCommentCount(data.data);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  useEffect(() => {
    fetchLikeData();
    fetchCommentCount();
  }, [story.id]);

  return (
    <div
      onClick={handleClick}
      className='flex items-stretch gap-6 p-6 transition-all duration-300 ease-in-out bg-gray-200 shadow-md cursor-pointer rounded-xl hover:shadow-lg dark:bg-stone-800'
    >
      {/* Left Section: Text Content (Full width if no banner) */}
      <div
        className={`flex flex-col justify-between ${story.bannerUrl ? 'flex-1' : 'w-full'}`}
      >
        <div>
          <h3 className='h-12 text-4xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-2'>
            {story.title}
          </h3>
          <div className='mt-3 text-gray-700 text-md dark:text-gray-300 line-clamp-3'>
            <MarkdownRenderer content={story.description} />
          </div>
        </div>

        {/* Meta Info & Actions */}
        <div className='flex items-center justify-between mt-6 text-gray-600 dark:text-gray-700'>
          <p className='dark:text-gray-400'>{story.authorName}</p>
          <div className='flex items-center gap-4'>
            <span className='text-gray-600 dark:text-gray-400'>
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className='flex items-center gap-1'>
              <FaRegHeart
                className={` dark:text-gray-400`}
                // ${isLiked ? 'text-red-500' : 'text-gray-600'}
              />{' '}
              <span className='text-gray-600 dark:text-gray-400'>
                {likeCount ? likeCount : ''}
              </span>
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment className='text-gray-600 dark:text-gray-400' />{' '}
              <span className='text-gray-600 dark:text-gray-400'>
                {commentCount ? commentCount : ''}
              </span>
            </span>
          </div>

          {/* <div className='flex items-center gap-2'>
            <FaBookmark className='text-gray-600 dark:text-white' />
            <FaEllipsisV className='text-gray-600 dark:text-white' />
          </div> */}
        </div>
      </div>

      {/* Right Section: Banner (Only if banner exists) */}
      {story.bannerUrl && (
        <div className='flex-shrink-0 w-48 h-48 overflow-hidden rounded-lg'>
          <img
            src={story.bannerUrl}
            alt={story.title}
            className='object-cover w-full h-full'
          />
        </div>
      )}
    </div>
  );
};

export default StoryCard;
