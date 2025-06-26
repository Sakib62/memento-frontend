import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

interface ResetPasswordParams {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const resetPassword = async ({
    userId,
    currentPassword,
    newPassword,
  }: ResetPasswordParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/api/auth/${userId}/reset-Password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful',
        text: 'Password has been updated successfully.',
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: errorMessage,
        // confirmButtonColor: '#d33',
        showConfirmButton: false,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
};
