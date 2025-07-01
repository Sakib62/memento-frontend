import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title: t('settings.update-profile.modal-title-success'),
        text: t('settings.update-profile.modal-text-success'),
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
        title: t('settings.update-profile.modal-text-failed'),
        timer: 3000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};
