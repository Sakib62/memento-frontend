import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStoryStats } from '../../hooks/useStoryStats';
import { Story } from '../../types/story';

const HomeStoryCard = ({ story }: { story: Story }) => {
  const navigate = useNavigate();

  const { likeCount, commentCount, loading, error } = useStoryStats(story.id);

  return (
    <div
      onClick={() => navigate(`/story/${story.id}`)}
      className='transition-all duration-200 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 '
    >
      {/* <div className='flex items-center justify-center h-48 bg-gray-200'>
        <span className='text-gray-500'>Banner Placeholder</span>
      </div> */}
      <div className='p-4'>
        <div className='mb-2'>
          <p
            className='hover:underline'
            onClick={e => {
              e.stopPropagation();
              navigate(`/profile/${story.authorUsername}`);
            }}
          >
            {story.authorName}
          </p>
          {/* <p>@{story.authorUsername}</p> */}
        </div>
        <div className='mb-4 space-y-4'>
          <h2 className='h-12 text-xl font-bold'>{story.title}</h2>
          <p className='h-12 line-clamp-2'>{story.description}</p>
        </div>
        <div className='flex justify-between text-gray-500'>
          <div className='flex space-x-4'>
            <span className='flex items-center gap-1'>
              <FaRegHeart />
              {likeCount}
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment />
              {commentCount}
            </span>
          </div>
          <span>
            {new Date(story.createdAt).toLocaleDateString('en-Us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeStoryCard;
