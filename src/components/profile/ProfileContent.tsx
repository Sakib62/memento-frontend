import { Role } from '../../constants/role';
import { useAuth } from '../../hooks/useAuth';
import { Stories } from '../../types/story';
import { User } from '../../types/user';
import AdminDashboard from '../AdminDashboard';
import ProfileSettings from './ProfileSettings';
import ProfileStories from './ProfileStories';

interface Props2 {
  type: 'created' | 'liked' | 'commented' | 'dashboard' | 'stats' | 'settings';
  stories: Stories;
}

interface Props {
  type: string;
  stories: Stories;
  user: User;
  onUserUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileContent = ({ type, stories, user, onUserUpdate }: Props) => {
  const { role, username } = useAuth();
  const isAdmin = role === Role.Admin;
  const isOwnProfile = user.username === username;

  return (
    <div className='min-h-screen p-6'>
      {type === 'dashboard' && isOwnProfile && isAdmin && <AdminDashboard />}
      {/* {type === 'stats' && isOwnProfile && isAdmin && <AdminStats stories={stories} />} */}
      {type === 'settings' && (isOwnProfile || isAdmin) && (
        <ProfileSettings user={user} onUserUpdate={onUserUpdate} />
      )}
      {['created', 'liked', 'commented'].includes(type) && (
        <ProfileStories
          stories={stories[type as keyof Stories] || stories.created}
        />
      )}
    </div>
  );
};

export default ProfileContent;
