import { Role } from '../../constants/role';
import { useAuth } from '../../hooks/useAuth';
import { UserWithStoryCount } from '../../types/user';

const ProfileHeader = ({ user }: { user: UserWithStoryCount }) => {
  const { token, username, role } = useAuth();
  return (
    <div className='flex flex-col justify-center h-auto p-6 pt-4 bg-[#f0f8ff] rounded-md rounded-b-none md:flex-row md:justify-between'>
      <div className='flex flex-col justify-center py-2 mb-8 md:items-start'>
        <div>
          <div className='mb-4'>
            <p className='text-2xl font-bold '>{user.name}</p>
          </div>
          <div>
            <p className='text-lg font-semibold text-stone-900'>
              Joined:{' '}
              <span className='font-mono font-normal'>
                {new Date(user.joinDate).toDateString()}
              </span>
            </p>
          </div>
          <div>
            <p className='text-lg font-semibold text-stone-900'>
              Email: <span className='font-mono font-normal'>{user.email}</span>
            </p>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-6'>
        <div>
          <p className='text-lg font-bold'>Created</p>
          <p className='font-serif text-xl font-semibold text-center'>
            {user.createdCount}
          </p>
        </div>
        {token && (
          <div>
            <p className='text-lg font-bold'>Liked</p>
            <p className='font-serif text-xl font-semibold text-center'>
              {user.likedCount}
            </p>
          </div>
        )}
        {token && (user.username === username || role === Role.Admin) && (
          <div>
            <p className='text-lg font-bold'>Commented</p>
            <p className='font-serif text-xl font-semibold text-center'>
              {user.commentedCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
