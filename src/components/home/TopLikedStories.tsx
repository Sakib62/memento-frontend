import { useTranslation } from 'react-i18next';
import { usePagedStories } from '../../hooks/story/usePagedStories';
import SkeletonStoryCard from '../Skeleton/SkeletonStoryCard';
import HomeStoryCard from '../story/HomeStoryCard';

const TopLikedStories = () => {
  const { t } = useTranslation();
  const limit = 6;
  const currentPage = 1;
  // const offset = (currentPage - 1) * limit;

  const { stories, loading, error } = usePagedStories(
    currentPage,
    limit,
    `/api/stories?filter=mostLiked`
  );

  // const handleNext = () => setCurrentPage(prev => prev + 1);
  // const handlePrev = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));

  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='mb-8'>
      <div className='mb-6 text-center'>
        <p className='text-3xl font-semibold text-gray-800 dark:text-white'>
          {t('home.top-liked')}
        </p>
      </div>
      <div className='grid grid-cols-1 gap-8 mb-6 sm:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? [...Array(6)].map((_, index) => <SkeletonStoryCard key={index} />)
          : stories.map(story => (
              <HomeStoryCard key={story.id} story={story} />
            ))}
      </div>
      {/* {loading ? (
        <div className='flex items-center justify-center space-x-4'>
          <div className='w-12 h-8 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
          <div className='w-16 h-10 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
          <div className='w-12 h-8 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          onPrev={handlePrev}
          onNext={handleNext}
          onPageSelect={setCurrentPage}
        />
      )} */}
    </div>
  );
};

export default TopLikedStories;
