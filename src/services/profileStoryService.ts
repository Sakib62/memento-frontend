import { Story } from '../types/story';

export const fetchUserLikedStories = async (
  userId: string,
  token: string | null,
  offset: number = 0,
  limit: number = 6
): Promise<Story[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${apiUrl}/api/users/${userId}/stories/liked?offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch liked stories');
  }

  const json = await response.json();
  return json.data;
};

export const fetchUserCommentedStories = async (
  userId: string,
  token: string | null,
  offset: number = 0,
  limit: number = 6
): Promise<Story[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${apiUrl}/api/users/${userId}/stories/commented?offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch commented stories');
  }

  const json = await response.json();
  return json.data;
};
