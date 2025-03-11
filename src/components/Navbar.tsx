import { useContext, useEffect, useRef, useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { clearAuthData } = authContext;
  const navigate = useNavigate();

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

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/search?pattern=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

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
          <FaSearch
            className='text-xl cursor-pointer absolute left-3 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95'
            onClick={handleSearch}
          />
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className='pl-10 px-4 py-2 w-full rounded-md border border-gray-300 text-black outline-none'
          />
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

              {/* Pop-up menu */}
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
    </nav>
  );
};

export default Navbar;
