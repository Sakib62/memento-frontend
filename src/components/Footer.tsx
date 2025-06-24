import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='w-full p-6 bg-stone-300 dark:bg-gray-800'>
      <div className='container flex flex-col items-center gap-4 mx-auto sm:grid sm:grid-cols-3 sm:items-center'>
        <div className='flex justify-center gap-4 sm:justify-start'>
          <Link
            to='/'
            className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
          >
            {t('footer.home')}
          </Link>
          <Link
            to='/about'
            className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
          >
            {t('footer.about')}
          </Link>
        </div>

        <div className='flex justify-center gap-4'>
          <a
            href='https://github.com/sakib62'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
          >
            <FaGithub size={20} />
          </a>
          <a
            href='https://www.linkedin.com/in/sakib-ul-islam/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
          >
            <FaLinkedin size={20} />
          </a>
        </div>

        <div className='flex justify-center text-sm text-center text-gray-500 sm:justify-end dark:text-gray-400 sm:text-right'>
          © {new Date().getFullYear()} Memento. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
