import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Story } from '../types/story';
import { User } from '../types/user';

export const useSearchResults = (searchQuery: string) => {
  const authContext = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchResults, setSearchResults] = useState<{
    users: User[];
    storyTitles: Story[];
    storyDescriptions: Story[];
  }>({
    users: [],
    storyTitles: [],
    storyDescriptions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults({ users: [], storyTitles: [], storyDescriptions: [] });
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiUrl}/api/search?pattern=${searchQuery}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authContext?.token || ''}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data.data);
      } catch (error) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, apiUrl, authContext?.token]);

  return { searchResults, loading, error };
};
