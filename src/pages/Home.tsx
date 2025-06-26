import LatestStories from '../components/home/LatestStories';
import TopLikedStories from '../components/home/TopLikedStories';

const Home = () => {
  return (
    <div className='min-h-screen px-4 py-12 bg-stone-100 sm:px-6 lg:px-8 dark:bg-stone-800'>
      <div className='mx-auto max-w-7xl'>
        <LatestStories />
        {/* <div className='my-12 border-t border-gray-300'></div> */}
        <TopLikedStories />
      </div>
    </div>
  );
};

export default Home;
