import { useState } from 'react';
import Swal from 'sweetalert2';

interface DeleteAccountParams {
  userId: string;
  token: string | null;
}

interface DeleteAccountResult {
  deleteAccount: (params: DeleteAccountParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteAccount = (): DeleteAccountResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async ({ userId, token }: DeleteAccountParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
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

      await Swal.fire({
        icon: 'success',
        title: 'Account Deleted',
        text: 'Account has been successfully deleted.',
        confirmButtonColor: '#3085d6',
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
