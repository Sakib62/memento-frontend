import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

interface ProfileTabsProps {
  activeTab:
    | 'created'
    | 'liked'
    | 'commented'
    | 'dashboard'
    | 'stats'
    | 'settings';
  setActiveTab: (
    tab: 'created' | 'liked' | 'commented' | 'dashboard' | 'stats' | 'settings'
  ) => void;
  profileUsername: string;
}

const ProfileTabs = ({ activeTab, setActiveTab, profileUsername }: any) => {
  const { t } = useTranslation();

  const tabs = [
    { key: 'created', label: t('profile-tabs.created') },
    { key: 'liked', label: t('profile-tabs.liked') },
    { key: 'commented', label: t('profile-tabs.commented') },
  ];
  const { role, username } = useAuth();
  const isAdmin = role === 1;
  const isOwnProfile = profileUsername === username;

  if (isOwnProfile && isAdmin) {
    tabs.push({ key: 'dashboard', label: t('profile-tabs.dashboard') });
    // tabs.push({ key: 'stats', label: t('profile-tabs.stats') });
  }

  if (isOwnProfile || isAdmin) {
    tabs.push({ key: 'settings', label: t('profile-tabs.settings') });
  }

  return (
    <div className='flex border-b rounded-md md:space-x-4 bg-fuchsia-400'>
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`relative p-2 inline-block ${
            activeTab === tab.key ? 'font-bold' : 'font-normal'
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
          <div
            className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-300 ${
              activeTab === tab.key ? 'bg-blue-500' : ''
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
