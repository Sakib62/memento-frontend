import { useContext, useEffect, useRef, useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchPopup from './SearchPopup';
import ThemeToggle from './ThemeToggle';

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
    <nav className='flex items-center w-full h-16 px-6 text-white bg-green-500 dark:bg-gray-800'>
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
            className='flex items-center border-2 dark:border-gray-500 border-gray-400 rounded-md p-2 w-full cursor-pointer bg-gray-50 dark:bg-gray-700'
          >
            <FaSearch className='text-xl text-gray-700 dark:text-gray-300' />
            <span className='ml-2 text-gray-500 dark:text-gray-300'>
              Search...
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <FaBell className='text-xl cursor-pointer text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95' />
          </li>

          <li>
            <button
              onClick={() => navigate('/write')}
              className='text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-all duration-300'
            >
              Write Blogs
            </button>
          </li>
          <ul className='flex space-x-4'>
            <li
              className='flex items-center space-x-2 cursor-pointer relative'
              ref={iconRef}
            >
              <FaUserAlt
                className='w-10 h-10 text-white border-2 border-white rounded-full p-2 bg-gray-600'
                onClick={() => setIsOpen(!isOpen)}
              />

              {isOpen && (
                <div
                  ref={menuRef}
                  className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10'
                >
                  <button
                    onClick={handleProfileClick}
                    className='w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-200'
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className='w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-200'
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
