import React from 'react';
import { IconType } from 'react-icons';

interface SubmitButtonProps {
  text: string;
  icon: IconType;
  gap?: string;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  icon: Icon,
  gap = 'gap-1',
  loading = false,
}) => {
  return (
    <button
      type='submit'
      className={`w-full py-2.5 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none  transition-all duration-300 flex items-center justify-center ${gap} ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
    >
      {loading ? (
        <svg
          className='w-5 h-5 mr-2 text-white animate-spin'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
            fill='none'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8v8H4z'
          />
        </svg>
      ) : (
        <Icon className='text-xl' />
      )}
      {text}
    </button>
  );
};

export default SubmitButton;
