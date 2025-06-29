import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title: t('settings.reset-pass.modal-success-title'),
        text: t('settings.reset-pass.modal-success-text'),
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
        title: t('settings.reset-pass.modal-error-title'),
        text: errorMessage,
        showConfirmButton: false,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
};
