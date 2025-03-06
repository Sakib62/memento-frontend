import { useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') handleSearch();
  // };

  return (
    <div className='flex flex-col min-h-screen bg-cyan-600'>
      <nav className='flex items-center w-full h-16 px-6 text-white bg-green-500'>
        <ul className='flex items-center justify-between w-full'>
          <div className='flex items-center space-x-3'>
            <li className='text-2xl font-bold'>Memento</li>
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
              // onKeyDown={handleKeyDown}
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

            <li className='flex items-center space-x-2 cursor-pointer'>
              <FaUserAlt className='w-10 h-10 text-white border-2 border-white rounded-full p-2 bg-gray-600' />
            </li>
          </div>
        </ul>
      </nav>

      <div className='flex flex-1 w-full'>
        <div className='w-1/4 p-4 bg-gray-200'>
          <h3>Sidebar left</h3>
        </div>

        <div className='flex-1 p-6 bg-white'>
          <h2>Center content</h2>
        </div>

        <div className='w-1/4 p-4 bg-gray-200'>
          <h3>Right Sidebar</h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
