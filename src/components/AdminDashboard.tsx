import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchUsers } from '../services/api';
import { User } from '../types/user';
import SkeletonAdminDashboard from './Skeleton/SkeletonAdminDashboard';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsers(token);
        setUsers(userData);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className='pb-4 rounded-lg'>
        <h2 className='mb-2 text-lg font-bold'>User List</h2>
        {[...Array(4)].map((_, index) => (
          <SkeletonAdminDashboard key={index} />
        ))}
      </div>
    );
  }
  if (error) return <p>{error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className='pb-4 rounded-lg'>
      <h2 className='mb-2 text-lg font-bold'>User List</h2>
      {users.map(user => (
        <div
          key={user.id}
          className='p-3 mb-4 font-medium text-blue-600 transition duration-200 bg-white rounded-lg shadow-md cursor-pointer dark:bg-stone-800 hover:shadow-lg'
          onClick={() => navigate(`/profile/${user.username}`)}
        >
          <p className='text-md line-clamp-1'>{user.name}</p>
          <p className='mt-1 overflow-hidden text-xs text-gray-500 line-clamp-1 dark:text-gray-300'>
            {user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
