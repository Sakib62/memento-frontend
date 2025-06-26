import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

export const useDeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, clearAuthData } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const deleteAccount = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      clearAuthData();

      await Swal.fire({
        icon: 'success',
        title: 'Account Deleted',
        text: 'Account has been successfully deleted.',
        timer: 1500,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Account Deletion Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteAccount, isLoading, error };
};
