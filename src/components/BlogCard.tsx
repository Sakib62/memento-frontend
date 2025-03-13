import { useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import { FaHeart, FaRegComment, FaShare, FaEllipsisV, FaSave, FaRegSave, FaBookmark } from 'react-icons/fa';

interface Story {
  id: number;
  title: string;
  description: string;
  bannerUrl: string;
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
      className="flex items-stretch gap-6 p-6 transition-all duration-300 ease-in-out bg-gray-100 shadow-md cursor-pointer rounded-xl hover:shadow-lg dark:bg-gray-200"
    >
      {/* Left Section: Text Content */}
      <div className="flex flex-col justify-between flex-1">
        {/* Title & Description (Main Row) */}
        <div>
          <h3 className="text-4xl font-semibold text-gray-800 dark:text-gray-800">
            {story.title}
          </h3>
          <p
            className="mt-3 text-gray-700 text-md dark:text-gray-800 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: parsedDescription }}
          />
        </div>

        {/* Meta Info & Actions (Bottom Row) */}
        <div className="flex items-center justify-between mt-4 text-gray-600 dark:text-gray-700">
          {/* Left: Date, Like, Comment */}
          <div className="flex items-center gap-4">
            <span>{story.date}Mar 13, 2025</span>
            <span className="flex items-center gap-1">
              <FaHeart />11
              {story.likes}
            </span>
            <span className="flex items-center gap-1">
              <FaRegComment />12
              {story.comments}
            </span>
          </div>

          {/* Right: Share & Options */}
          <div className="flex items-center gap-4">
            <FaBookmark className='mr-3'/>
            <FaEllipsisV />
          </div>
        </div>
      </div>

      {/* Right Section: Story Banner */}
      <div className="w-48 h-48 overflow-hidden rounded-lg">
        <img
          src={story.bannerUrl}
          alt={story.title}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default BlogCard;
