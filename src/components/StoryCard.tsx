import MarkdownIt from 'markdown-it';
import { useContext, useEffect, useState } from 'react';
import { FaBookmark, FaEllipsisV, FaHeart, FaRegComment } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Story {
  id: number;
  title: string;
  description: string;
  bannerUrl?: string | null; // Allow null or undefined
  createdAt: string;
  likes: number;
  comments: number;
}

const StoryCard = ({ story }: { story: Story }) => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }
  const { token } = authContext;

  const navigate = useNavigate();
  const mdParser = new MarkdownIt();

  const parsedDescription = mdParser.render(story.description);

  const handleClick = () => {
    navigate(`/story/${story.id}`, { state: story });
  };

  const [likeCount, setLikeCount] = useState<number>(story.likes);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
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

    fetchLikeData();
  }, [story.id]);

  return (
    <div
      onClick={handleClick}
      className='flex items-stretch gap-6 p-6 transition-all duration-300 ease-in-out bg-gray-100 shadow-md cursor-pointer rounded-xl hover:shadow-lg dark:bg-gray-900'
    >
      {/* Left Section: Text Content (Full width if no banner) */}
      <div
        className={`flex flex-col justify-between ${story.bannerUrl ? 'flex-1' : 'w-full'}`}
      >
        <div>
          <h3 className='text-4xl font-semibold text-gray-800 dark:text-gray-100'>
            {story.title}
          </h3>
          <p
            className='mt-3 text-gray-700 text-md dark:text-gray-100 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: parsedDescription }}
          />
        </div>

        {/* Meta Info & Actions */}
        <div className='flex items-center justify-between mt-4 text-gray-600 dark:text-gray-700'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-600 dark:text-white'>
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className='flex items-center gap-1'>
              <FaHeart
                className={`${isLiked ? 'text-red-500' : 'text-gray-600'} dark:text-white`}
              />{' '}
              {likeCount ? likeCount : ''}
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment className='text-gray-600 dark:text-white' />{' '}
              {story.comments}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <FaBookmark className='text-gray-600 dark:text-white' />
            <FaEllipsisV className='text-gray-600 dark:text-white' />
          </div>
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
