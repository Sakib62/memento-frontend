import React from 'react';

interface AuthLayoutProps {
  imageSrc?: string;
  imageAlt?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ maxWidth = '', children }) => {
  return (
    <div className='relative flex items-center justify-center min-h-screen px-4 py-10 overflow-auto bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-400'>
      <div className='absolute inset-0 bg-black opacity-10'></div>

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
