import MarkdownIt from 'markdown-it';
import { FaBookmark, FaEllipsisV, FaHeart, FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Story {
  id: number;
  title: string;
  description: string;
  bannerUrl?: string | null; // Allow null or undefined
  date: string;
  likes: number;
  comments: number;
}

const BlogCard = ({ story }: { story: Story }) => {
  const navigate = useNavigate();
  const mdParser = new MarkdownIt();

  const parsedDescription = mdParser.render(story.description);

  const handleClick = () => {
    navigate(`/blog/${story.id}`, { state: story });
  };

  return (
    <div
      onClick={handleClick}
      className='flex items-stretch gap-6 p-6 transition-all duration-300 ease-in-out bg-gray-100 shadow-md cursor-pointer rounded-xl hover:shadow-lg dark:bg-gray-900'
    >
      {/* Left Section: Text Content (Full width if no banner) */}
      <div className={`flex flex-col justify-between ${story.bannerUrl ? 'flex-1' : 'w-full'}`}>
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
            <span className="text-gray-600 dark:text-white">{story.date}11 Mar, 2025</span>
            <span className='flex items-center gap-1'>
              <FaHeart className="text-gray-600 dark:text-white"/> {story.likes}
            </span>
            <span className='flex items-center gap-1'>
              <FaRegComment className="text-gray-600 dark:text-white"/> {story.comments}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <FaBookmark className="text-gray-600 dark:text-white" />
            <FaEllipsisV className="text-gray-600 dark:text-white"/>
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

export default BlogCard;
