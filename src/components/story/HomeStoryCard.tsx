import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../types/story';
import MarkdownRenderer from './MarkdownRenderer';

const HomeStoryCard = ({
  story,
  isForProfile = false,
}: {
  story: Story;
  isForProfile?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/story/${story.id}`)}
      className='transition-all duration-200 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1'
    >
      {/* <div className='flex items-center justify-center h-48 bg-gray-200'>
        <span className='text-gray-500'>Banner Placeholder</span>
      </div> */}
      <div className='p-4'>
        {!isForProfile && (
          <div className='mb-2'>
            <p
              className='font-serif hover:underline'
              onClick={e => {
                e.stopPropagation();
                navigate(`/profile/${story.authorUsername}`);
              }}
            >
              {story.authorName}
            </p>
          </div>
        )}
        <div className='mb-4 space-y-4'>
          <h2 className='h-8 text-xl font-bold line-clamp-1'>{story.title}</h2>
          <div className='h-12 line-clamp-2'>
            <MarkdownRenderer content={story.description} />
          </div>
        </div>
        <div className='flex justify-start gap-4 text-gray-500'>
          <span>
            {new Date(story.createdAt).toLocaleDateString('en-Us', {
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
    </div>
  );
};

export default HomeStoryCard;
