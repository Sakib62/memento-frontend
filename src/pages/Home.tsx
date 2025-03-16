import { useContext, useEffect, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { Navigate } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
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

  const totalPages = 10;
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchStories = async (page: number) => {
    if (!token) {
      console.error('No token available');
      return;
    }

    const offset = (page - 1) * limit;

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      setStories(data.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    fetchStories(currentPage);
  }, [token, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-300 dark:bg-gray-600'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>

      <div className='flex justify-center w-full p-6 mt-5 space-x-6'>
        <div className='flex flex-col w-full max-w-4xl overflow-y-auto'>
          {/* <h2 className='mb-4 text-2xl font-semibold dark:text-white'>
            Latest Stories
          </h2> */}
          <div className='grid h-full grid-cols-1 gap-4 md:grid-cols-2'>
            {stories.length > 0 ? (
              stories.map(story => <StoryCard key={story.id} story={story} />)
            ) : (
              <div className='flex items-center justify-center h-full col-span-1 text-gray-500 md:col-span-2'>
                No stories available
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className='flex items-center justify-center pb-5 mt-10 space-x-4'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 text-white bg-blue-600 rounded-lg dark:bg-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-500'
            >
              <FaArrowLeftLong />
            </button>
            {/* Page numbers */}
            <div className='flex space-x-2'>
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`px-4 py-2 text-white rounded-lg ${currentPage === page + 1 ? 'bg-blue-600 dark:bg-gray-800' : 'bg-blue-400 dark:bg-gray-500'}`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 text-white bg-blue-600 rounded-lg dark:bg-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-500'
            >
              <FaArrowRightLong />
            </button>
          </div>
        </div>

        <div className='w-1/5 p-4 space-y-8 overflow-y-auto rounded-lg'>
        
          {/* Trending Section */}
          <div>
            <h3 className='text-lg font-semibold dark:text-white'>Trending</h3>
            <ul className='mt-4 space-y-2 text-gray-700'>
              <li className='pb-1 dark:text-white'>Trending Story 1</li>
              <li className='pb-1 dark:text-white'>Trending Story 2</li>
            </ul>
          </div>

          {/* Topics Section */}
          <div>
            <h3 className='text-lg font-semibold dark:text-white'>Tags</h3>
            <ul className='mt-4 space-y-2 text-gray-700'>
              <li className='pb-1 dark:text-white'>Technology</li>
              <li className='pb-1 dark:text-white'>Science</li>
              <li className='pb-1 dark:text-white'>Business</li>
            </ul>
          </div>

          {/* Latest Section */}
          <div>
            <h3 className='text-lg font-semibold dark:text-white'>Latest</h3>
            <ul className='mt-4 space-y-2 text-gray-700'>
              <li className='pb-1 dark:text-white'>Latest Story 1</li>
              <li className='pb-1 dark:text-white'>Latest Story 2</li>
              <li className='pb-1 dark:text-white'>Latest Story 3</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
