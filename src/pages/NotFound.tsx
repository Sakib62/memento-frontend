import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800'>
      <div className='max-w-md p-8 text-center bg-white rounded-lg shadow-xl dark:bg-gray-700'>
        <div className='flex justify-center mb-4 text-6xl text-red-500'>
          <FaExclamationTriangle />
        </div>
        <h1 className='mb-4 text-4xl font-extrabold text-gray-800 dark:text-white'>
          {t('not-found.title')}
        </h1>
        <p className='mb-6 text-lg text-gray-600 dark:text-gray-300'>
          {t('not-found.message')}
        </p>
        <Link
          to='/'
          className='px-6 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700'
        >
          {t('not-found.back-home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
