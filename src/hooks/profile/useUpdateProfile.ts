import { useState } from 'react';
import Swal from 'sweetalert2';
import { User } from '../../types/user';
import { useAuth } from '../useAuth';

interface UpdateProfileParams {
  userId: string;
  updatedData: Partial<User>;
}

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const updateProfile = async ({
    userId,
    updatedData,
  }: UpdateProfileParams) => {
    setIsLoading(true);
    setError(null);

    try {
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

      const updatedUser = await response.json();

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Profile has been updated successfully.',
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      return updatedUser.data;
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
