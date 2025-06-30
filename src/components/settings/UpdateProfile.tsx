import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useUpdateProfile } from '../../hooks/profile/useUpdateProfile';
import useUserInfo from '../../hooks/profile/useUserInfo';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/user';
import { FormInput, Heading, SubmitButton } from './Shared';

const UpdateProfile = () => {
  const { username } = useAuth();
  const { t } = useTranslation();

  const [localUserInfo, setLocalUserInfo] = useState<User | null>(null);
  const { userInfo, loading } = useUserInfo(username!);
  const { updateProfile, isLoading } = useUpdateProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userInfo) {
      setLocalUserInfo(userInfo);
      setName(userInfo.name ?? '');
      setEmail(userInfo.email ?? '');
    }
  }, [userInfo]);

  const isUnchanged =
    name.trim() === (localUserInfo?.name?.trim() ?? '') &&
    email.trim() === (localUserInfo?.email?.trim() ?? '');

  const renderSkeletonField = (label: string, id: string) => (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-600'>
        {label}
      </label>
      <div className='w-full h-10 mt-1 bg-gray-200 rounded-md md:w-3/4 animate-pulse' />
    </div>
  );

  if (!localUserInfo || loading)
    return (
      <div className='mb-6'>
        <Heading title={t('settings.update-profile.heading')} />
        <div className='mb-4 space-y-4'>
          {renderSkeletonField(t('settings.update-profile.full-name'), 'name')}
          {renderSkeletonField(t('settings.update-profile.email'), 'email')}
        </div>
        <SubmitButton
          text={t('settings.update-profile.submit-btn')}
          bgColor='bg-blue-600'
          type='submit'
          disabled={isLoading || loading || isUnchanged}
        />
      </div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: { name?: string; email?: string } = {};

    if (name.trim() !== localUserInfo.name.trim()) {
      updates.name = name.trim();
    }
    if (email.trim() !== localUserInfo.email.trim()) {
      updates.email = email.trim();
    }

    if (Object.keys(updates).length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Nothing to Update',
        text: 'Make changes before saving.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const updatedUser = await updateProfile({
        userId: localUserInfo.id,
        updatedData: updates,
      });
      setLocalUserInfo(updatedUser);
      setName(updatedUser.name ?? name);
      setEmail(updatedUser.email ?? email);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className='mb-6'>
      <Heading title={t('settings.update-profile.heading')} />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          label={t('settings.update-profile.full-name')}
          id='name'
          type='text'
          value={name!}
          onChange={e => setName(e.target.value)}
          placeholder={t('settings.update-profile.placeholder-name')}
        />

        <FormInput
          label={t('settings.update-profile.email')}
          id='email'
          type='email'
          value={email!}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('settings.update-profile.placeholder-email')}
        />

        <SubmitButton
          text={
            isLoading
              ? `${t('settings.update-profile.submit-btn-loading')}...`
              : `${t('settings.update-profile.submit-btn')}`
          }
          bgColor='bg-blue-600'
          type='submit'
          disabled={isLoading || loading || isUnchanged}
        />
      </form>
    </div>
  );
};

export default UpdateProfile;
