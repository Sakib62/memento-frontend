import { JSX } from 'react';
import { Story } from '../types/story';
import { User } from '../types/user';

const SearchResultSection = <T extends User | Story>({
  title,
  data,
  emptyMessage,
  onClick,
  primary,
  secondary,
  loading,
}: {
  title: string;
  data: T[];
  emptyMessage: string;
  onClick: (item: T) => void;
  primary: (item: T) => string;
  secondary: (item: T) => JSX.Element;
  loading?: boolean;
}) => (
  <div>
    <h3 className='mb-2 font-bold text-gray-500 dark:text-white'>{title}</h3>
    {loading ? (
      <div className='space-y-2'>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className='p-3 bg-white rounded-lg shadow-md dark:bg-stone-800 animate-pulse'
          >
            <div className='w-3/4 h-5 mb-1 bg-gray-300 rounded'></div>
            <div className='w-1/2 h-4 bg-gray-300 rounded'></div>
          </div>
        ))}
      </div>
    ) : data?.length ? (
      data.map((item, index) => (
        <div
          key={index}
          className='p-3 mb-2 font-medium text-blue-600 transition duration-200 bg-white rounded-lg shadow-md cursor-pointer dark:bg-stone-800 hover:shadow-lg'
          onClick={() => onClick(item)}
        >
          <p className='text-md line-clamp-1'>{primary(item)}</p>
          <div className='mt-1 overflow-hidden text-xs text-gray-500 line-clamp-1 dark:text-gray-300'>
            {secondary(item)}
          </div>
        </div>
      ))
    ) : (
      <p className='mt-2 text-sm text-gray-500 dark:text-gray-300'>
        {emptyMessage}
      </p>
    )}
  </div>
);

export default SearchResultSection;
