import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
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
    toast.success(t('sign-out.manual'));
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
        className='w-10 h-10 p-2 text-white bg-blue-700 border-2 rounded-full border-slate-300 hover:bg-blue-800 hover:border-sky-200'
        onClick={toggleMenu}
      />

      {isOpen && (
        <div className='absolute right-0 z-10 px-2 py-1 mt-2 transition-all duration-200 ease-in-out transform scale-95 bg-gray-100 rounded-lg shadow-lg w-28 dark:bg-gray-800 top-10 hover:scale-100'>
          <button
            onClick={handleProfileClick}
            className='w-full px-2 py-1.5 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:font-semibold border-b-2'
          >
            {t('navbar.profile')}
          </button>
          <button
            onClick={() => {
              navigate('/settings');
            }}
            className='w-full px-2 py-1.5 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:font-semibold border-b-2'
          >
            {t('navbar.settings')}
          </button>
          <button
            onClick={handleLogoutClick}
            className='w-full px-2 py-1.5 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:font-semibold'
          >
            {t('navbar.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
