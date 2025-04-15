import { Comment } from '../types/comment';

const apiUrl = import.meta.env.VITE_API_URL;

export const commentService = {
  fetchComments: async (
    storyId: string,
    token: string,
    clearAuthData: () => void
  ): Promise<Comment[]> => {
    const response = await fetch(`${apiUrl}/api/stories/${storyId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthData();
    }

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await response.json();
    return data.data;
  },

  createComment: async (
    storyId: string,
    token: string,
    comment: string
  ): Promise<Comment> => {
    const response = await fetch(`${apiUrl}/api/stories/${storyId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to post comment');
    }
    const data = await response.json();
    return data.data;
  },

  updateComment: async (
    commentId: string,
    token: string,
    comment: string
  ): Promise<Comment> => {
    const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to update comment');
    }
    const data = await response.json();
    return data.data;
  },

  deleteComment: async (commentId: string, token: string): Promise<void> => {
    const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  },
};
