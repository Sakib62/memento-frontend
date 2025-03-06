import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: { exp?: number } = jwtDecode(token);
    const expiryTime = decoded.exp ?? 0;
    const isExpired = expiryTime * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    return false;
  }
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
