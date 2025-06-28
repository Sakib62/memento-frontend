import LatestStories from '../components/home/LatestStories';
import TopLikedStories from '../components/home/TopLikedStories';

const Home = () => {
  return (
    <div className='min-h-screen px-8 py-12 bg-stone-100 dark:bg-stone-800'>
      <div className='mx-auto max-w-7xl'>
        <LatestStories />
        <TopLikedStories />
      </div>
    </div>
  );
};

export default Home;
