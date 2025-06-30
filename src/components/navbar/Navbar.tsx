import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useAuthPromptModal from '../../hooks/useAuthPrompt';
import LanguageSwitcher from './LanguageSwitcher';
import ProfileMenu from './ProfileMenu';
import SearchPopup from './SearchPopup';

const Navbar = () => {
  const { token } = useAuth();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const authPromptModal = useAuthPromptModal();

  const toggleSearchPopup = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className='sticky top-0 left-0 right-0 z-10 flex items-center w-full h-16 px-2 text-gray-900 bg-blue-500 shadow-md md:px-4'>
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
            className='flex items-center w-full p-2 bg-gray-100 border-2 border-gray-300 rounded-md cursor-pointer'
          >
            <FaSearch className='hidden text-xl text-gray-600 md:inline' />
            <span className='ml-1 text-gray-600'>{t('navbar.search')}</span>
          </div>
        </div>

        <div className='flex items-center space-x-2 md:space-x-4'>
          {/* <ThemeToggle /> */}
          <LanguageSwitcher />
          <span>
            <button
              onClick={() =>
                token ? navigate('/new-story') : authPromptModal()
              }
              className='flex items-center justify-center gap-1 p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 md:w-20'
            >
              <FaRegPenToSquare className='w-4 h-4 md:h-5 md:w-5' />
              <span className='hidden md:inline'>{t('navbar.write')}</span>
            </button>
          </span>
          {token ? (
            <ProfileMenu />
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='p-1 font-medium text-white bg-blue-700 rounded-md md:p-2 hover:bg-blue-800'
            >
              Sign In
            </button>
          )}
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
