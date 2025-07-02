import { useSearchParams } from 'react-router-dom';
import LatestStories from '../components/home/LatestStories';
import TopLikedStories from '../components/home/TopLikedStories';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('latestPage') || '1', 10);

  const setCurrentPage = (page: number) => {
    setSearchParams({ latestPage: page.toString() });
  };

  const scrollToLatest = () => {
    const element = document.getElementById('latest-stories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='min-h-screen px-8 py-8 bg-stone-100'>
      <div className='p-10 mb-8 text-center text-gray-800 rounded-lg shadow bg-gradient-to-r from-blue-100 via-white to-blue-100'>
        <h1 className='mb-2 text-3xl font-bold md:text-4xl'>
          Start Your Story with{' '}
          <span className='font-extrabold text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text'>
            Memento
          </span>
        </h1>

        <p className='mb-4 italic'>Explore. Share. Inspire.</p>
        <button
          onClick={scrollToLatest}
          aria-label='Scroll to latest stories'
          className='px-4 py-3 font-semibold text-white bg-blue-500 rounded-md md:px-6 hover:bg-blue-600'
        >
          Start Reading ↓
        </button>
      </div>

      <div id='latest-stories' className='mx-auto max-w-7xl'>
        <LatestStories
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <TopLikedStories />
      </div>
    </div>
  );
};

export default Home;
