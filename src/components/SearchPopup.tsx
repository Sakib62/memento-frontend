import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SearchPopup = ({ closePopup, searchQuery, setSearchQuery }: any) => {
  const authContext = useContext(AuthContext);

  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const [searchResults, setSearchResults] = useState<any>({
    users: [],
    storyTitles: [],
    storyDescriptions: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults({ users: [], storyTitles: [], storyDescriptions: [] });
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/api/search?pattern=${searchQuery}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authContext.token}`,
            },
          }
        );
        const data = await response.json();
        setSearchResults(data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div
      className='fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50'
      onClick={closePopup}
    >
      <div
        className='dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 rounded-lg p-6 w-[50%] max-h-[60%] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >

        <input
          ref={inputRef}
          type='text'
          placeholder='Search Users, Titles, Descriptions'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 mb-5 text-black border border-gray-300 rounded-md focus:outline-none dark:border-gray-600 '
        />

        <div className='space-y-4'>
          <div>
            <h3 className='mb-1 font-bold text-gray-400'>Users</h3>
            {searchResults.users && searchResults.users.length > 0 ? (
              searchResults.users.map((user: any, index: number) => (
                <div key={index}>
                  <p>{user.username}</p>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>

          <hr className='my-4 border-slate-400' />

          <div>
            <h3 className='mb-1 font-bold text-gray-400'>Story by Titles</h3>
            {searchResults.storyTitles &&
            searchResults.storyTitles.length > 0 ? (
              searchResults.storyTitles.map((story: any, index: number) => (
                <div key={index}>
                  <p>{story.title}</p>
                </div>
              ))
            ) : (
              <p>No titles found</p>
            )}
          </div>

          <hr className='my-4 border-slate-400' />

          <div>
            <h3 className='mb-1 font-bold text-gray-400'>
              Story by Descriptions
            </h3>
            {searchResults.storyDescriptions &&
            searchResults.storyDescriptions.length > 0 ? (
              searchResults.storyDescriptions.map(
                (story: any, index: number) => (
                  <div key={index}>
                    <p>{story.description}</p>
                  </div>
                )
              )
            ) : (
              <p>No descriptions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
