import { Story } from '../types/story';

export const fetchUserLikedStories = async (
  userId: string,
  token: string | null
): Promise<Story[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(`${apiUrl}/api/users/${userId}/stories/liked`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch liked stories');
  }

  const json = await response.json();
  return json.data;
};

export const fetchUserCommentedStories = async (
  userId: string,
  token: string | null
): Promise<Story[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${apiUrl}/api/users/${userId}/stories/commented`,
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
