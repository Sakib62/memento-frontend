import { useState } from 'react';
import Swal from 'sweetalert2';
import { User } from '../types/user';

interface UpdateProfileParams {
  userId: string;
  token: string | null;
  updatedData: Partial<User>;
}

interface UpdateProfileResult {
  updateProfile: (params: UpdateProfileParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useUpdateProfile = (): UpdateProfileResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async ({
    userId,
    token,
    updatedData,
  }: UpdateProfileParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Profile has been updated successfully.',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Profile Update Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};
