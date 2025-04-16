import { useTranslation } from 'react-i18next';
import { User } from '../../types/user';
import { Role } from '../../constants/role';

const InfoSection: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className='p-3 bg-gray-300 rounded-lg shadow-md'>
    <p className='text-sm text-gray-600'>{label}:</p>
    <p className='text-sm font-medium text-gray-800'>{value}</p>
  </div>
);

const ProfileSidebar = ({ user }: { user: User }) => {
  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const { t } = useTranslation();

  return (
    <aside className='top-0 flex flex-col w-full h-full p-6 border-r shadow-lg bg-sky-400 md:max-w-[350px]'>
      <div className='flex flex-col items-center mt-24'>
        <div className='flex items-center justify-center w-20 h-20 text-lg font-semibold text-gray-500 bg-gray-300 rounded-full'>
          {user.name.charAt(0)}
        </div>
        <h2 className='mt-4 text-lg font-bold text-gray-800'>{user.name}</h2>
        <p className='text-gray-600 text-md'>@{user.username}</p>
      </div>

      <div className='mt-20 space-y-4'>
        <div className='space-y-6'>
          <InfoSection label='Email' value={user.email} />
          <InfoSection
            label={t('profile-sidebar.joined')}
            value={formattedJoinDate}
          />
          <InfoSection
            label={t('profile-sidebar.role')}
            value={
              user.role === Role.Admin
                ? t('profile-sidebar.admin')
                : t('profile-sidebar.user')
            }
          />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
