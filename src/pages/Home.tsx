import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }
  const [stories, setStories] = useState<any[]>([]);
  const { token } = authContext;

  useEffect(() => {
    const fetchStories = async () => {
      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/stories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }

        const data = await response.json();
        setStories(data.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, [token]);

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Navbar />

      <div className='flex flex-1 w-full justify-center p-6 mt-5 space-x-6'>
        <div className='w-full max-w-4xl'>
          <h2 className='text-2xl font-semibold mb-4'>Latest Blogs</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-full'>
            {stories.length > 0 ? (
              stories.map(story => <BlogCard key={story.id} story={story} />)
            ) : (
              <div className='col-span-1 md:col-span-2  flex justify-center items-center h-full text-gray-500'>
                No stories available
              </div>
            )}
          </div>
        </div>

        <div className='w-1/4 bg-white p-4 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold'>🔥 Trending</h3>
          <ul className='mt-2 text-gray-700 space-y-2'>
            <li className='border-b pb-2'>📖 Trending Blog 1</li>
            <li className='border-b pb-2'>📖 Trending Blog 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
