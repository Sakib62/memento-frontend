import { useEffect, useRef, useState } from 'react';
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
  const limit = 6;

  const { userInfo, loading } = useUserInfo(username || '', true);

  const {
    createdStories,
    hasNextPage: hasMoreCreated,
    loading: createdLoading,
    loadMore: loadMoreCreated,
  } = useUserStories(username || '');

  const [likedStories, setLikedStories] = useState<Story[]>([]);
  const [likedPage, setLikedPage] = useState(1);
  const [hasMoreLiked, setHasMoreLiked] = useState(false);
  const [likedLoading, setLikedLoading] = useState(false);
  const likedFetchTracker = useRef<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<ProfileTab>('created');

  useEffect(() => {
    setActiveTab('created');

    setLikedStories([]);
    setLikedPage(1);
    setHasMoreLiked(false);
    likedFetchTracker.current = {};

    setCommentedStories([]);
    setCommentedPage(1);
    setHasMoreCommented(false);
    commentedFetchTracker.current = {};
  }, [username, id]);

  useEffect(() => {
    if (activeTab !== 'liked' || !userInfo?.id || !token) return;

    const fetchLikedStories = async () => {
      const fetchKey = `${userInfo.id}-${likedPage}`;

      if (likedFetchTracker.current[fetchKey]) return;
      likedFetchTracker.current[fetchKey] = true;

      setLikedLoading(true);
      try {
        const offset = (likedPage - 1) * limit;
        const response = await fetchUserLikedStories(
          userInfo.id,
          token,
          offset,
          limit + 1
        );

        const fetchedStories = response;
        setLikedStories(prev => [...prev, ...fetchedStories.slice(0, limit)]);
        setHasMoreLiked(fetchedStories.length > limit);
      } catch (error) {
        console.error('Error fetching liked stories:', error);
      } finally {
        setLikedLoading(false);
      }
    };

    fetchLikedStories();
  }, [activeTab, likedPage, userInfo?.id, token]);

  const loadMoreLiked = () => {
    if (!likedLoading && hasMoreLiked) {
      setLikedPage(prev => prev + 1);
    }
  };

  const [commentedStories, setCommentedStories] = useState<Story[]>([]);
  const [commentedPage, setCommentedPage] = useState(1);
  const [hasMoreCommented, setHasMoreCommented] = useState(false);
  const [commentedLoading, setCommentedLoading] = useState(false);
  const commentedFetchTracker = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (activeTab !== 'commented' || !userInfo?.id || !token) return;

    const fetchCommentedStories = async () => {
      const fetchKey = `${userInfo.id}-${commentedPage}`;

      if (commentedFetchTracker.current[fetchKey]) return;
      commentedFetchTracker.current[fetchKey] = true;

      setCommentedLoading(true);
      try {
        const offset = (commentedPage - 1) * limit;
        const fetchedStories = await fetchUserCommentedStories(
          userInfo.id,
          token,
          offset,
          limit + 1
        );

        setCommentedStories(prev => [
          ...prev,
          ...fetchedStories.slice(0, limit),
        ]);
        setHasMoreCommented(fetchedStories.length > limit);
      } catch (error) {
        console.error('Error fetching commented stories:', error);
      } finally {
        setCommentedLoading(false);
      }
    };

    fetchCommentedStories();
  }, [activeTab, commentedPage, userInfo?.id, token, limit]);

  const loadMoreCommented = () => {
    if (!commentedLoading && hasMoreCommented) {
      setCommentedPage(prev => prev + 1);
    }
  };

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

  const displayStories =
    activeTab === 'created'
      ? createdStories
      : activeTab === 'liked'
        ? likedStories
        : commentedStories;

  const isLoading =
    activeTab === 'created'
      ? createdLoading
      : activeTab === 'liked'
        ? likedLoading
        : commentedLoading;

  const hasMoreStories =
    activeTab === 'created'
      ? hasMoreCreated
      : activeTab === 'liked'
        ? hasMoreLiked
        : hasMoreCommented;

  const handleLoadMore = () => {
    if (activeTab === 'created') {
      loadMoreCreated();
    } else if (activeTab === 'liked') {
      loadMoreLiked();
    } else if (activeTab === 'commented') {
      loadMoreCommented();
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <ProfileHeader user={userInfo} />

      <div className='p-2 pb-0 pl-6 space-x-2 md:space-x-4 font-sans bg-[#dcf3ff] font-light border-b-2 border-gray-300'>
        {visibleTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as ProfileTab)}
            className={`border-b-2 px-2 font-medium rounded-md hover:border-blue-500 ${
              activeTab === tab
                ? 'border-blue-700 bg-[#38BDF8] font-bold'
                : 'border-blue-400 bg-[#bae6fd] hover:bg-[#7dd3fc]'
            }`}
          >
            {t(`profile.tabs.${profileTabLabels[tab]}`, profileTabLabels[tab])}
          </button>
        ))}
      </div>

      <div className='flex-grow bg-gray-100'>
        <div className='grid grid-cols-1 gap-8 p-6 md:grid-cols-2 lg:grid-cols-3'>
          {displayStories.length === 0 &&
            isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonStoryCard
                key={`initial-${i}`}
                isForProfile={activeTab === 'created'}
              />
            ))}

          {displayStories.length > 0 ? (
            displayStories.map(story => (
              <HomeStoryCard
                key={story.id}
                story={story}
                isForProfile={activeTab === 'created'}
              />
            ))
          ) : !isLoading ? (
            <p className='pl-2 mt-10 text-xl font-semibold text-center text-gray-500 col-span-full'>
              {t('profile.no-story', 'No stories found')}
            </p>
          ) : null}

          {isLoading &&
            displayStories.length > 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonStoryCard
                key={`loading-${i}`}
                isForProfile={activeTab === 'created'}
              />
            ))}
        </div>

        {!isLoading && hasMoreStories && (
          <div className='flex justify-center pb-8'>
            <button
              onClick={handleLoadMore}
              className='px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'
            >
              {t('profile.loadMore', 'Load More')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
