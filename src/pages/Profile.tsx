import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import SkeletonProfileHeader from '../components/Skeleton/SkeletonProfileHeader';
import SkeletonStoryCard from '../components/Skeleton/SkeletonStoryCard';
import HomeStoryCard from '../components/story/HomeStoryCard';
import { Role } from '../constants/role';
import useUserInfo from '../hooks/profile/useUserInfo';
import useUserStories from '../hooks/story/useUserStories';
import { useAuth } from '../hooks/useAuth';
import {
  fetchUserCommentedStories,
  fetchUserLikedStories,
} from '../services/profileStoryService';
import { ProfileTab, profileTabLabels } from '../types/profileTab';
import { Story } from '../types/story';

const Profile = () => {
  const { username } = useParams();
  const { id, role, token } = useAuth();
  const { t } = useTranslation();

  const { userInfo, loading } = useUserInfo(username || '', true);
  const { createdStories, loading: createdLoading } = useUserStories(
    username || ''
  );

  const [likedStories, setLikedStories] = useState<Story[]>([]);
  const [isLikedFetched, setIsLikedFetched] = useState(false);
  const [likedLoading, setLikedLoading] = useState(false);

  const [commentedStories, setCommentedStories] = useState<Story[]>([]);
  const [isCommentedFetched, setIsCommentedFetched] = useState(false);
  const [commentedLoading, setCommentedLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<ProfileTab>('created');

  useEffect(() => {
    setActiveTab('created');
  }, [username, id]);

  useEffect(() => {
    const getLikedStories = async () => {
      setLikedLoading(true);
      try {
        const data = await fetchUserLikedStories(userInfo?.id || '', token);
        setLikedStories(data);
        setIsLikedFetched(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLikedLoading(false);
      }
    };

    if (activeTab === 'liked' && !isLikedFetched && userInfo?.id && token) {
      getLikedStories();
    }

    const getCommentedStories = async () => {
      setCommentedLoading(true);
      try {
        const data = await fetchUserCommentedStories(userInfo?.id || '', token);
        setCommentedStories(data);
        setIsCommentedFetched(true);
      } catch (err) {
        console.error(err);
      } finally {
        setCommentedLoading(false);
      }
    };

    if (
      activeTab === 'commented' &&
      !isCommentedFetched &&
      userInfo?.id &&
      token
    ) {
      getCommentedStories();
    }
  }, [activeTab, isLikedFetched, isCommentedFetched, userInfo?.id, token]);

  if (!userInfo || loading) return <SkeletonProfileHeader />;

  const isOwner = userInfo.id === id;
  const isAdmin = role === Role.Admin;
  const isLoggedIn = !!token;

  const visibleTabs: ProfileTab[] = ['created'];
  if (isLoggedIn) {
    visibleTabs.push('liked');
  }
  if (isOwner || isAdmin) {
    visibleTabs.push('commented');
  }

  const renderStories = (
    loading: boolean,
    stories: Story[],
    skeletonCount = 6,
    isForProfile = false
  ) => {
    if (loading) {
      return Array.from({ length: skeletonCount }).map((_, index) => (
        <SkeletonStoryCard key={index} isForProfile={isForProfile} />
      ));
    }

    if (!stories.length) {
      return (
        <p className='pl-2 text-gray-500 col-span-full'>
          {t('profile.no-story')}
        </p>
      );
    }

    return stories.map(story => (
      <HomeStoryCard key={story.id} story={story} isForProfile={isForProfile} />
    ));
  };

  return (
    <div className='flex flex-col p-6 px-8'>
      <ProfileHeader user={userInfo} />

      <div className='p-2 pb-0 space-x-6 font-mono bg-[#fcfcf7] font-light border-b-2 border-gray-300'>
        {visibleTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2  hover:border-blue-400  ${activeTab === tab ? 'border-blue-600 font-semibold' : 'border-transparent'}`}
          >
            {t(`profile.tabs.${profileTabLabels[tab]}`, profileTabLabels[tab])}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-8 mt-6 md:grid-cols-2 lg:grid-cols-3'>
        {activeTab === 'created' &&
          renderStories(createdLoading, createdStories, 6, true)}

        {activeTab === 'liked' &&
          isLoggedIn &&
          renderStories(likedLoading, likedStories)}

        {activeTab === 'commented' &&
          (isOwner || isAdmin) &&
          renderStories(commentedLoading, commentedStories)}
      </div>
    </div>
  );
};

export default Profile;
