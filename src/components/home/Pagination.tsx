import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
}

const Pagination = ({
  currentPage,
  hasNextPage,
  onPrev,
  onNext,
  onPageSelect,
}: PaginationProps) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const previousPages = [...Array(currentPage - 1).keys()].map(i => i + 1);

  return (
    <div className='flex items-center justify-center space-x-4'>
      <div className='relative flex items-center space-x-2'>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-white rounded-lg shadow-md ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {t('home.prev')}
        </button>

        {/* <button
          onClick={toggleDropdown}
          className={`flex items-center text-2xl rounded-lg  focus:outline-none `}
          disabled={currentPage <= 1}
        >
          <FaArrowUp
            className={`text-gray-600 dark:text-gray-200 ${
              currentPage <= 1
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : ''
            }`}
          />
        </button> */}

        {isDropdownOpen && currentPage > 1 && (
          <div className='absolute top-0 z-10 overflow-y-auto -translate-x-1/2 bg-white border rounded-lg shadow-lg left-12 -translate-y-1/4 max-h-28'>
            {previousPages.map(page => (
              <div
                key={page}
                onClick={() => {
                  onPageSelect(page);
                  setIsDropdownOpen(false);
                }}
                className='px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200'
              >
                {t('home.page')} {page}
              </div>
            ))}
          </div>
        )}
      </div>

      <span className='flex items-center px-4 py-2 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md'>
        {t('home.page')} {currentPage}
      </span>

      <button
        onClick={onNext}
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
  );
};

export default Pagination;
