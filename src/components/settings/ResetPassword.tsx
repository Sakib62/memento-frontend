import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { z } from 'zod';
import { useResetPassword } from '../../hooks/profile/useResetPassword';
import { useAuth } from '../../hooks/useAuth';
import { FormInput, Heading, SubmitButton } from './Shared';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { resetPassword, isLoading } = useResetPassword();
  const { id } = useAuth();
  const { t } = useTranslation();

  const passwordSchema = z.object({
    currentPassword: z
      .string()
      .min(6, t('settings.reset-pass.curr-pass-too-short')),
    newPassword: z.string().min(6, t('settings.reset-pass.new-pass-too-short')),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const errorMessage = errors.map(err => err.message).join('<br/>');
      Swal.fire({
        icon: 'error',
        title: t('settings.reset-pass.validation-error'),
        html: errorMessage,
        timer: 3000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: t('settings.reset-pass.mismatch-title'),
        text: t('settings.reset-pass.mismatch-text'),
        timer: 3000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      return;
    }

    await resetPassword({ userId: id || '', currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className='mb-6'>
      <Heading title={t('settings.reset-pass.heading')} />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          label={t('settings.reset-pass.curr-pass')}
          id='currentPassword'
          type='password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder={t('settings.reset-pass.placeholder-curr-pass')}
          required={true}
        />
        <FormInput
          label={t('settings.reset-pass.new-pass')}
          id='newPassword'
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder={t('settings.reset-pass.placeholder-new-pass')}
          required={true}
        />
        <FormInput
          label={t('settings.reset-pass.confirm-pass')}
          id='confirmNewPassword'
          type='password'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          placeholder={t('settings.reset-pass.placeholder-confirm-pass')}
          required={true}
        />
        <SubmitButton
          text={
            isLoading
              ? `${t('settings.reset-pass.submit-btn-loading')}...`
              : `${t('settings.reset-pass.submit-btn')}`
          }
          bgColor='bg-gray-600'
          type='submit'
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default ResetPassword;
