import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import ProfileMenu from './ProfileMenu';
import SearchPopup from './SearchPopup';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearchPopup = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className='sticky top-0 left-0 right-0 z-10 flex items-center w-full h-16 px-4 text-gray-900 bg-blue-500 shadow-md dark:bg-neutral-800 dark:text-gray-100'>
      <ul className='flex items-center justify-between w-full'>
        <div className='flex items-center space-x-3'>
          <li
            className='text-2xl font-bold cursor-pointer'
            onClick={() => navigate('/')}
          >
            M<span className='hidden md:inline-block'>emento</span>
          </li>
        </div>

        <div className='flex justify-center items-center md:w-[40%] md:max-w-[400px] relative max-w-[200px] w-[30%]'>
          <div
            onClick={toggleSearchPopup}
            className='flex items-center w-full p-2 bg-gray-100 border-2 border-gray-300 rounded-md cursor-pointer dark:border-gray-600 dark:bg-gray-700'
          >
            <FaSearch className='text-xl text-gray-600 dark:text-gray-300' />
            <span className='ml-2 text-gray-600 dark:text-gray-300 '>
              {t('navbar.search')}
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-2 md:space-x-4'>
          <ThemeToggle />
          <LanguageSwitcher />
          <li>
            <button
              onClick={() => navigate('/new-story')}
              className='flex items-center w-24 gap-1 px-4 py-2 text-white transition-all duration-300 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 md:w-28'
            >
              <SquarePen className='w-4 h-4 mr-1 md:mr-2 md:h-5 md:w-5' />
              <span>{t('navbar.write')}</span>
            </button>
          </li>
          <ProfileMenu />
        </div>
      </ul>

      {isSearchOpen && (
        <SearchPopup
          closePopup={toggleSearchPopup}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
    </nav>
  );
};

export default Navbar;
