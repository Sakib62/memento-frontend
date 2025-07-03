import React from 'react';
import { GrLinkPrevious } from 'react-icons/gr';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  imageSrc?: string;
  imageAlt?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ maxWidth = '', children }) => {
  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen px-4 py-10 overflow-auto bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-400'>
      <div className='absolute inset-0 '></div>

      <div className='relative z-10 w-full max-w-md mb-4'>
        <Link
          to='/'
          className='inline-flex items-center px-3 py-1 text-white transition-colors rounded-md bg-blue-500/80 hover:bg-blue-600/60'
        >
          <GrLinkPrevious className='mr-1' />
          Home
        </Link>
      </div>

      <div
        className={`relative z-10 mx-auto w-full max-w-md bg-white shadow-2xl rounded-xl shadow-blue-500/30 ${maxWidth}`}
      >
        <div className='w-full p-6 md:p-8'>
          <h1 className='mb-6 text-4xl font-bold text-center text-gray-800'>
            Memento
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
