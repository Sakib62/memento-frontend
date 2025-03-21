import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='w-full p-6 bg-stone-300 dark:bg-gray-800'>
      <div className='container flex flex-col items-center justify-between gap-4 mx-auto sm:flex-row'>
        <div className='flex flex-col items-center sm:items-start'>
          <nav className='flex gap-4'>
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
            <Link
              to='/new-story'
              className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
            >
              {t('footer.write-a-story')}
            </Link>
          </nav>
        </div>

        <div className='flex gap-4'>
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

        <p className='text-sm text-gray-500 dark:text-gray-400'>
          © {new Date().getFullYear()} Memento. {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
