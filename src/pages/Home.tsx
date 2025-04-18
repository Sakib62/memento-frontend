import { Navigate } from 'react-router-dom';
import LatestStories from '../components/home/LatestStories';
import TopLikedStories from '../components/home/TopLikedStories';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to='/login' />;

  return (
    <div className='min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8 dark:bg-stone-600'>
      <div className='mx-auto max-w-7xl'>
        <LatestStories />
        <div className='my-12 border-t border-gray-300'></div>
        <TopLikedStories />
      </div>
    </div>
  );
};

export default Home;
