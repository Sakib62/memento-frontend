import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentedStories from '../components/profile/CommentedStories';
import LikedStories from '../components/profile/LikedStories';
import ProfileHeader from '../components/profile/ProfileHeader';
import SkeletonProfileHeader from '../components/Skeleton/SkeletonProfileHeader';
import HomeStoryCard from '../components/story/HomeStoryCard';
import { Role } from '../constants/role';
import useUserInfo from '../hooks/profile/useUserInfo';
import useUserStories from '../hooks/story/useUserStories';
import { useAuth } from '../hooks/useAuth';
import { ProfileTab, profileTabLabels } from '../types/profileTab';

const Profile = () => {
  const { username } = useParams();
  const { id, role } = useAuth();

  const { userInfo, loading } = useUserInfo(username || '', true);

  const { createdStories } = useUserStories(username || '');

  const [activeTab, setActiveTab] = useState<ProfileTab>('created');

  useEffect(() => {
    setActiveTab('created');
  }, [username, id]);

  if (!userInfo || loading) return <SkeletonProfileHeader />;

  const isOwner = userInfo.id === id;
  const isAdmin = role === Role.Admin;
  const isLoggedIn = !!id;

  const visibleTabs: ProfileTab[] = ['created'];
  if (isLoggedIn) {
    visibleTabs.push('liked');
  }
  if (isOwner || isAdmin) {
    visibleTabs.push('commented');
    visibleTabs.push('statistics');
  }

  return (
    <div className='flex flex-col p-6 px-8'>
      <ProfileHeader user={userInfo} />

      <div className='p-2 pb-0 space-x-6 font-mono bg-[#fcfcf7] font-light border-b-2 border-gray-300'>
        {visibleTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 border-transparent hover:border-blue-500  ${activeTab === tab ? 'border-blue-600 font-semibold' : ''}`}
          >
            {profileTabLabels[tab]}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-8 mt-6 md:grid-cols-2 lg:grid-cols-3'>
        {activeTab === 'created' &&
          createdStories.map(story => (
            <HomeStoryCard key={story.id} story={story} isForProfile={true} />
          ))}

        {activeTab === 'liked' && isLoggedIn && (
          <LikedStories userId={userInfo.id} />
        )}
        {activeTab === 'commented' && (isOwner || isAdmin) && (
          <CommentedStories userId={userInfo.id} />
        )}

        {activeTab === 'statistics' && (isOwner || isAdmin) && (
          <div className='p-4 text-gray-700 dark:text-gray-200'>
            <p>Statistics view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
