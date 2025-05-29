import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagedStories } from '../../hooks/usePagedStories';
import SkeletonStoryCard from '../Skeleton/SkeletonStoryCard';
import StoryCard from '../story/StoryCard';
import Pagination from './Pagination';

const TopLikedStories = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const { stories, loading, error, hasNextPage } = usePagedStories(
    currentPage,
    limit,
    `/api/stories?offset=${offset}&limit=${limit + 1}&filter=mostLiked`
  );

  const handleNext = () => setCurrentPage(prev => prev + 1);
  const handlePrev = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));

  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='mb-8'>
      <div className='mb-10 text-center'>
        <h2 className='text-4xl font-semibold text-gray-800 dark:text-white'>
          {t('home.top-liked')}
        </h2>
      </div>
      <div className='grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? [...Array(6)].map((_, index) => <SkeletonStoryCard key={index} />)
          : stories.map(story => <StoryCard key={story.id} story={story} />)}
      </div>
      {loading ? (
        <div className='flex items-center justify-center space-x-4'>
          <div className='w-20 h-10 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
          <div className='w-24 h-10 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
          <div className='w-20 h-10 bg-gray-300 rounded-lg dark:bg-stone-600 animate-pulse'></div>
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

export default TopLikedStories;
