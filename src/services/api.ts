import { Stories, Story } from '../types/story';
import { User } from '../types/user';

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchUser(
  username: string | undefined,
  token: string | null,
  clearAuthData: () => void
): Promise<User | null> {
  const response = await fetch(`${apiUrl}/api/users/username/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearAuthData();
    return null;
  }

  if (!response.ok) throw new Error('Failed to fetch user');
  const data = await response.json();
  return data.data as User;
}

export async function fetchAllStories(
  username: string | undefined,
  userId: string | undefined,
  token: string | null
): Promise<Stories> {
  const endpoints = {
    created: `${apiUrl}/api/stories/author/${username}`,
    liked: userId ? `${apiUrl}/api/users/${userId}/stories/liked` : null,
    commented: userId
      ? `${apiUrl}/api/users/${userId}/stories/commented`
      : null,
  };

  const promises = Object.entries(endpoints)
    .filter(([, url]) => url !== null)
    .map(async ([type, url]) => {
      const response = await fetch(url as string, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch ${type} stories`);
      const data = await response.json();
      return [type, data.data] as [string, Story[]];
    });

  const results = await Promise.all(promises);
  const stories = Object.fromEntries(results) as Partial<Stories>;

  return {
    created: stories.created || [],
    liked: stories.liked || [],
    commented: stories.commented || [],
  };
}

export async function fetchUsers(token: string | null): Promise<User[]> {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.data as User[];
}
