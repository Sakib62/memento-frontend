import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../types/story';
import MarkdownRenderer from './MarkdownRenderer';

const StoryCard = ({ story }: { story: Story }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${story.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className='flex items-stretch gap-4 p-4 transition-all duration-300 ease-in-out bg-white shadow-md cursor-pointer rounded-xl hover:shadow-xl dark:bg-stone-700'
    >
      <div className={`flex flex-col justify-between w-full`}>
        <div>
          <h3 className='h-8 text-2xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-1'>
            {story.title}
          </h3>
          <div className='mt-3 text-gray-700 text-md dark:text-gray-300 line-clamp-2 min-h-[48px]'>
            <MarkdownRenderer content={story.description} />
          </div>
        </div>

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
              <FaRegHeart className={` dark:text-gray-400`} />{' '}
              <span className='text-gray-600 dark:text-gray-400'>
                {story.likeCount ? story.likeCount : ''}
              </span>
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment className='text-gray-600 dark:text-gray-400' />{' '}
              <span className='text-gray-600 dark:text-gray-400'>
                {story.commentCount ? story.commentCount : ''}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
