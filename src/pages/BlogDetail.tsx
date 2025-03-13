import MarkdownIt from 'markdown-it';
import { useEffect } from 'react';
import {
  FaBookmark,
  FaComment,
  FaEllipsisH,
  FaHeart,
  FaShare,
  FaUserCircle,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div>
      <Navbar />

      <div className='max-w-3xl p-4 mx-auto'>
        <div className='w-full h-48 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'></div>

        <div className='flex items-center gap-4 p-4 pl-0 mb-4 bg-white rounded-lg'>
          <FaUserCircle className='text-4xl text-gray-500' />
          <div>
            <p className='text-lg font-semibold'>{authorUsername}</p>
            <p className='text-sm text-gray-500'>Published on March 12, 2025</p>
          </div>
        </div>

        <div className='flex items-center justify-between px-2 mb-6 text-gray-600'>
          <div className='flex gap-4'>
            <button className='flex items-center gap-1 hover:text-red-500'>
              <FaHeart size='23' /> 11
            </button>
            <button className='flex items-center gap-1 hover:text-blue-500'>
              <FaComment size='23' /> 12
            </button>
          </div>
          <div className='flex gap-8'>
            <button className='flex items-center gap-1 hover:text-green-500'>
              <FaShare size='23' />
            </button>
            <button className='flex items-center gap-1 hover:text-yellow-500'>
              <FaBookmark size='23' />
            </button>
            <button className='relative flex items-center gap-1 group hover:scale-105'>
              <FaEllipsisH size='23' />
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                More
              </span>
            </button>
          </div>
        </div>

        <h1 className='mb-4 text-3xl font-bold'>{title}</h1>
        <p
          className='text-lg leading-relaxed text-gray-700'
          dangerouslySetInnerHTML={{ __html: parsedDescription }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
