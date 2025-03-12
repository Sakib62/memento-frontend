import { useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';

interface Story {
  id: number;
  title: string;
  description: string;
}

const BlogCard = ({ story }: { story: Story }) => {
  const navigate = useNavigate();

  const mdParser = new MarkdownIt();

  const parsedDescription = mdParser.render(story.description);

  const handleClick = () => {
    navigate(`/blog/${story.id}`, { state: { ...story, parsedDescription } });
  };

  return (
    <div
      onClick={handleClick}
      className='bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 cursor-pointer hover:shadow-lg'
    >
      <h3 className='text-xl font-bold dark:text-gray-300'>{story.title}</h3>
      <p
        className='text-gray-600 dark:text-gray-300 mt-2'
        dangerouslySetInnerHTML={{ __html: parsedDescription }}
      />
    </div>
  );
};

export default BlogCard;
