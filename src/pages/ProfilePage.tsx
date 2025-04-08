import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileTabs from '../components/profile/ProfileTabs';
import SkeletonProfileSidebar from '../components/Skeleton/SkeletonProfileSidebar';
import SkeletonProfileStories from '../components/Skeleton/SkeletonProfileStories';
import SkeletonProfileTabs from '../components/Skeleton/SkeletonProfileTabs';
import { AuthContext } from '../context/AuthContext';
import { useStories } from '../hooks/useStories';
import { fetchUser } from '../services/api';
import { User } from '../types/user';

const ProfilePage = () => {
  const { token } = useContext(AuthContext) || {};
  if (!token) return <Navigate to='/login' />;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { username } = useParams<string>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState('');

  const {
    stories,
    loading: storiesLoading,
    error: storiesError,
  } = useStories(username ?? '', profileUser?.id ?? '', token);

  const [activeTab, setActiveTab] = useState<
    'created' | 'liked' | 'commented' | 'dashboard' | 'stats' | 'settings'
  >('created');

  const handleUserUpdate = (updatedUser: Partial<User>) => {
    if (profileUser) {
      setProfileUser({ ...profileUser, ...updatedUser });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setUserLoading(true);
      setUserError('');
      setProfileUser(null);
      setActiveTab('created');
      try {
        const userData = await fetchUser(username ?? '', token);
        setProfileUser(userData);
        setActiveTab('created');
      } catch (err) {
        setUserError('Error fetching profile.');
        Swal.fire({
          icon: 'error',
          title: t('profile.userNotFoundTitle'),
          text: t('profile.userNotFoundText'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: t('profile.goToHome'),
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(result => {
          if (result.isConfirmed) {
            navigate('/', { replace: true });
          }
        });
      } finally {
        setUserLoading(false);
      }
    };
    fetchProfile();
  }, [username, token]);

  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      <div className='w-full md:w-1/4 md:min-w-[250px] md:max-w-[350px] bg-white md:sticky md:top-16'>
        {userLoading ? (
          <SkeletonProfileSidebar />
        ) : userError || !profileUser ? (
          <div className='p-6'>
            <p className='text-red-600'>{t('profile.loadingError')}</p>
          </div>
        ) : (
          <ProfileSidebar user={profileUser} />
        )}
      </div>

      <div className='flex flex-col w-full bg-gray-200 md:flex-1'>
        <div className='sticky p-6 pb-4 bg-gray-200 z-9 top-16'>
          {userLoading ? (
            <SkeletonProfileTabs />
          ) : userError || !profileUser ? (
            <p className='text-red-600'>{t('profile.loadingError')}</p>
          ) : (
            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profileUsername={profileUser.username}
            />
          )}
        </div>

        <div className='bg-gray-200 h-[calc(100vh-4rem)] overflow-y-auto custom-scroll'>
          {userLoading || userError || !profileUser ? (
            <div className='p-6 pt-0'>
              {userLoading ? (
                <SkeletonProfileStories />
              ) : (
                <p className='text-red-600'>{t('profile.loadingError')}</p>
              )}
            </div>
          ) : storiesLoading ? (
            <div className='p-6 pt-0'>
              <SkeletonProfileStories />
            </div>
          ) : storiesError ? (
            <div className='p-6 pt-0'>
              <p className='text-red-600'>{storiesError}</p>
            </div>
          ) : (
            <ProfileContent
              type={activeTab}
              stories={stories}
              user={profileUser}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
