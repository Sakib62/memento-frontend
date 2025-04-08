import React from 'react';

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  maxWidth?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  imageSrc,
  imageAlt,
  maxWidth = '',
  children,
}) => {
  return (
    <div className='relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-400'>
      <div className='absolute inset-0 bg-black opacity-10'></div>

      <div
        className={`relative z-10 flex w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-xl shadow-blue-500/30 ${maxWidth}`}
      >
        <div className='hidden w-1/2 bg-gray-100 md:block'>
          <img
            src={imageSrc}
            alt={imageAlt}
            className='object-cover w-full h-full'
          />
        </div>

        <div className='w-full p-8 md:w-1/2 md:p-10'>
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
