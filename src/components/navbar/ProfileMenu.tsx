import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProfileMenu = () => {
  const { username, clearAuthData } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsOpen(prev => !prev);

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    clearAuthData();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className='relative flex items-center space-x-2 cursor-pointer'
    >
      <FaUserAlt
        className='w-10 h-10 p-2 text-white bg-gray-500 border-2 border-white rounded-full dark:bg-gray-600'
        onClick={toggleMenu}
      />

      {isOpen && (
        <div className='absolute right-0 z-10 w-24 py-1 mt-2 transition-all duration-200 ease-in-out transform scale-95 bg-gray-100 rounded-lg shadow-lg dark:bg-gray-800 top-10 hover:scale-100'>
          <button
            onClick={handleProfileClick}
            className='w-full px-2 py-1.5 text-sm text-center text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            {t('navbar.profile')}
          </button>
          <button
            onClick={() => {
              navigate('/settings');
            }}
            className='w-full px-2 py-1.5 text-sm text-center text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            Settings
          </button>
          <button
            onClick={handleLogoutClick}
            className='w-full px-2 py-1.5 text-sm text-center text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            {t('navbar.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
