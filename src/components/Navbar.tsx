import { useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  return (
    <nav className='flex items-center w-full h-16 px-6 text-white bg-green-500'>
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
            <FaBell className='text-xl cursor-pointer text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95' />
          </li>

          <li className='cursor-pointer hover:text-gray-300'>Write Blogs</li>

          <li
            className='flex items-center space-x-2 cursor-pointer'
            onClick={() => navigate('/profile')}
          >
            <FaUserAlt className='w-10 h-10 text-white border-2 border-white rounded-full p-2 bg-gray-600' />
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
