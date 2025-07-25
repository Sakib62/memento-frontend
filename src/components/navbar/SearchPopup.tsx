import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchResults } from '../../hooks/useSearchResults';
import { Story } from '../../types/story';
import { User } from '../../types/user';
import MarkdownRenderer from '../story/MarkdownRenderer';
import SearchResultSection from './SearchResultSection';

const SearchPopup = ({
  closePopup,
  searchQuery,
  setSearchQuery,
}: {
  closePopup: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const { searchResults, loading, error } = useSearchResults(searchQuery);

  return (
    <div
      className='fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50'
      onClick={closePopup}
    >
      <div
        className='dark:bg-stone-700 h-fit bg-gray-100 dark:text-white text-gray-800 rounded-lg p-6 w-[80%] md:w-[50%] max-h-[60%] overflow-y-auto transition-all duration-300'
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type='text'
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 mb-5 text-black border border-gray-300 rounded-md focus:outline-none dark:border-gray-600 '
        />

        {error && <p className='mb-4 text-sm text-red-500'>{error}</p>}

        {searchQuery && (
          <div className='space-y-4'>
            <SearchResultSection<User>
              title={t('search.users')}
              data={searchResults.users || []}
              emptyMessage={t('search.no-user')}
              getLink={user => `/profile/${user.username}`}
              onClick={() => {
                setSearchQuery('');
                closePopup();
              }}
              primary={user => user.name}
              secondary={user => <>{user.username}</>}
              loading={loading}
            />
            <hr className='my-4 border-slate-400' />

            <SearchResultSection<Story>
              title={t('search.story-by-title')}
              data={searchResults.storyTitles || []}
              emptyMessage={t('search.no-title')}
              getLink={story => `/story/${story.id}`}
              onClick={() => {
                setSearchQuery('');
                closePopup();
              }}
              primary={story => story.title}
              secondary={story => (
                <MarkdownRenderer content={story.description} />
              )}
              loading={loading}
            />
            <hr className='my-4 border-slate-400' />

            <SearchResultSection<Story>
              title={t('search.story-by-desc')}
              data={searchResults.storyDescriptions || []}
              emptyMessage={t('search.no-desc')}
              getLink={story => `/story/${story.id}`}
              onClick={() => {
                setSearchQuery('');
                closePopup();
              }}
              primary={story => story.title}
              secondary={story => (
                <MarkdownRenderer content={story.description} />
              )}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPopup;
