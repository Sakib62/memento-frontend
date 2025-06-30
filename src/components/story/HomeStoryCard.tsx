import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Story } from '../../types/story';
import MarkdownRenderer from './MarkdownRenderer';

const HomeStoryCard = ({
  story,
  isForProfile = false,
}: {
  story: Story;
  isForProfile?: boolean;
}) => {
  return (
    <Link
      to={`/story/${story.id}`}
      className='block transition-all duration-200 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 min-h-[200px]'
    >
      <div className='p-4'>
        {!isForProfile && (
          <div className='mb-2'>
            <Link
              to={`/profile/${story.authorUsername}`}
              className='font-serif truncate hover:underline w-fit'
              onClick={e => e.stopPropagation()}
              title={story.authorName}
            >
              {story.authorName}
            </Link>
          </div>
        )}
        <div className='mb-4 space-y-4'>
          <h2 className='h-8 text-xl font-bold line-clamp-1'>{story.title}</h2>
          <div className='h-12 break-words line-clamp-2'>
            <MarkdownRenderer content={story.description} />
          </div>
        </div>
        <div className='flex justify-start gap-4 text-gray-500 min-h-[24px]'>
          <span className='flex items-center'>
            {new Date(story.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <div className='flex space-x-4'>
            <span className='flex items-center gap-1'>
              <FaRegHeart />
              {story.likeCount}
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment />
              {story.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeStoryCard;
