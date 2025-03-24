import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const { t } = useTranslation();

  const { token } = authContext;

  const [stories, setStories] = useState<any[]>([]);
  const [topLikedStories, setTopLikedStories] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const limit = 6;

  const fetchLatestStories = async (page: number) => {
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories?limit=${limit + 1}&offset=${offset}`,
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
      setHasNextPage(data.data.length > limit);
      setStories(data.data.slice(0, limit));
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const fetchTopLikedStories = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/liked/top`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top liked stories');
      }

      const data = await response.json();
      setTopLikedStories(data.data);
    } catch (error) {
      console.error('Error fetching top liked stories:', error);
    }
  };

  useEffect(() => {
    fetchLatestStories(currentPage);
  }, [token, currentPage]);

  useEffect(() => {
    fetchTopLikedStories();
  }, [token]);

  const handleNext = () => setCurrentPage(prev => prev + 1);
  const handlePrev = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  return (
    <div className='min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8 dark:bg-stone-600'>
      <div
        onClick={() => {
          if (isDropdownOpen) setIsDropdownOpen(false);
        }}
        className='mx-auto max-w-7xl'
      >
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-semibold text-gray-800 dark:text-white'>
            {t('home.title')}
          </h1>
        </div>
        <div className='grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-2'>
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className='flex items-center justify-center space-x-4'>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-lg shadow-md ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {t('home.prev')}
          </button>

          {/* Page Selector (Opens on Click) */}
          <div className='relative'>
            <button
              onClick={toggleDropdown}
              className='px-4 py-2 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none'
            >
              Page {currentPage}
            </button>

            {isDropdownOpen && (
              <div className='absolute left-0 z-10 mt-0 overflow-y-auto -translate-y-1/2 bg-white border rounded-lg shadow-lg top-1/2 max-h-28' >
                {[...Array(15 + (hasNextPage ? 1 : 0)).keys()].map(
                  (_, index) => (
                    <div
                      key={index + 1}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        setIsDropdownOpen(false); // Close on selection
                      }}
                      className='px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200'
                    >
                     Page {index + 1}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!hasNextPage}
            className={`px-4 py-2 text-white rounded-lg shadow-md ${
              !hasNextPage
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {t('home.next')}
          </button>
        </div>

        <div className='my-16 border-t border-gray-300'></div>

        <div className='mb-12 text-center'>
          <h2 className='text-3xl font-semibold text-gray-800 dark:text-white'>
            {t('home.top-liked')}
          </h2>
        </div>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2'>
          {topLikedStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
