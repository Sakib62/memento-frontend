import {
  FaBookmark,
  FaComment,
  FaHeart,
  FaShare,
  FaUserCircle,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const story = location.state?.story;

  if (!story) {
    navigate('/');
    return null;
  }

  const { authorUsername, title, description } = story;

  return (
    <div>
      <Navbar />

      <div className='max-w-3xl mx-auto p-4'>
        <div className='w-full h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-6'></div>

        <div className='flex items-center gap-4 mb-4 p-4 pl-0 bg-white  rounded-lg'>
          <FaUserCircle className='text-4xl text-gray-500' />
          <div>
            <p className='text-lg font-semibold'>{authorUsername}</p>
            <p className='text-sm text-gray-500'>Published on March 12, 2025</p>
          </div>
        </div>

        <div className='flex justify-between items-center text-gray-600 mb-6 px-2'>
          <div className='flex gap-4'>
            <button className='flex items-center gap-1 hover:text-red-500'>
              <FaHeart /> Like
            </button>
            <button className='flex items-center gap-1 hover:text-blue-500'>
              <FaComment /> Comment
            </button>
          </div>
          <div className='flex gap-4'>
            <button className='flex items-center gap-1 hover:text-green-500'>
              <FaShare /> Share
            </button>
            <button className='flex items-center gap-1 hover:text-yellow-500'>
              <FaBookmark /> Save
            </button>
          </div>
        </div>

        <h1 className='text-3xl font-bold mb-4'>{title}</h1>
        <p className='text-lg leading-relaxed text-gray-700'>{description}
        </p>
      </div>
    </div>
  );
};

export default BlogDetails;
