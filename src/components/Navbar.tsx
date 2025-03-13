import { useContext, useEffect, useRef, useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchPopup from './SearchPopup';
import ThemeToggle from './ThemeToggle';

import { SquarePen } from 'lucide-react';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { clearAuthData } = authContext;
  const navigate = useNavigate();

  const toggleSearchPopup = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    clearAuthData();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className='flex items-center w-full h-16 px-6 text-gray-900 bg-blue-500 dark:bg-zinc-800 dark:text-gray-100'>
      <ul className='flex items-center justify-between w-full'>
        <div className='flex items-center space-x-3'>
          <li
            className='text-2xl font-bold cursor-pointer'
            onClick={() => navigate('/')}
          >
            Memento
          </li>
        </div>

        <div className='flex justify-center items-center w-[40%] max-w-[400px] relative'>

          <div
            onClick={toggleSearchPopup}
            className='flex items-center w-full p-2 bg-gray-100 border-2 border-gray-300 rounded-md cursor-pointer dark:border-gray-600 dark:bg-gray-700'
          >
            <FaSearch className='text-xl text-gray-600 dark:text-gray-300' />
            <span className='ml-2 text-gray-600 dark:text-gray-300'>
              Search...
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <FaBell className='text-xl text-gray-600 transition-all duration-300 transform cursor-pointer hover:text-gray-800 hover:scale-110 active:scale-95 dark:text-gray-300 dark:hover:text-gray-200' />
          </li>

          <li>
            <button
              onClick={() => navigate('/write')}
              className='flex items-center gap-1 px-4 py-2 text-white transition-all duration-300 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
            >
              <SquarePen className='w-5 h-5 mr-2' />
              <span>Write</span>
            </button>
          </li>
          <ul className='flex space-x-4'>
            <li
              className='relative flex items-center space-x-2 cursor-pointer '
              ref={iconRef}
            >
              <FaUserAlt
                className='w-10 h-10 p-2 text-white bg-gray-500 border-2 border-white rounded-full dark:bg-gray-600'
                onClick={() => setIsOpen(!isOpen)}
              />

              {isOpen && (
                <div
                  ref={menuRef}
                  className='absolute right-0 z-10 w-48 py-2 mt-2 bg-gray-100 rounded-lg shadow-lg dark:bg-gray-800'
                >
                  <button
                    onClick={handleProfileClick}
                    className='w-full px-4 py-2 text-sm text-left text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className='w-full px-4 py-2 text-sm text-left text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
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
