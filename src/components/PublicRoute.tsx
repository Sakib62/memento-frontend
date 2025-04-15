import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? <Navigate to='/' /> : <Outlet />;
};

export default PublicRoute;
