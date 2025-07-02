import { useTranslation } from 'react-i18next';
import { usePagedStories } from '../../hooks/story/usePagedStories';
import SkeletonStoryCard from '../Skeleton/SkeletonStoryCard';
import HomeStoryCard from '../story/HomeStoryCard';
import Pagination from './Pagination';

type LatestStoriesProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const LatestStories = ({ currentPage, setCurrentPage }: LatestStoriesProps) => {
  const { t } = useTranslation();
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const { stories, loading, error, hasNextPage } = usePagedStories(
    currentPage,
    limit,
    `/api/stories?offset=${offset}&limit=${limit + 1}`
  );

  const handleNext = () => {
    if (hasNextPage) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='mb-8'>
      <div className='mb-6 text-center'>
        <p className='text-3xl font-semibold text-gray-800 dark:text-white'>
          {t('home.title')}
        </p>
      </div>
      <div className='grid grid-cols-1 gap-8 mb-6 sm:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? [...Array(limit)].map((_, index) => (
              <SkeletonStoryCard key={index} />
            ))
          : stories.map(story => (
              <HomeStoryCard key={story.id} story={story} />
            ))}
      </div>
      {loading ? (
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
      )}
    </div>
  );
};

export default LatestStories;
