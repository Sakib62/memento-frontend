import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('memento_token');
    if (storedToken) {
      try {
        const decoded: {
          id: string;
          username: string;
          name: string;
          role: number;
          exp?: number;
        } = jwtDecode(storedToken);

        const expiryTime = decoded.exp ? decoded.exp * 1000 : 0;
        if (Date.now() >= expiryTime) {
          clearAuthData();
        } else {
          setToken(storedToken);
          setId(decoded.id);
          setUsername(decoded.username);
          setName(name);
          setRole(decoded.role);
        }
      } catch (error) {
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const setAuthData = (newToken: string) => {
    localStorage.setItem('memento_token', newToken);
    const decoded: {
      id: string;
      username: string;
      name: string;
      role: number;
    } = jwtDecode(newToken);
    setToken(newToken);
    setId(decoded.id);
    setUsername(decoded.username);
    setName(name);
    setRole(decoded.role);
  };

  const clearAuthData = () => {
    setToken(null);
    setId(null);
    setUsername(null);
    setName(null);
    setRole(null);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('memento_')) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        id,
        username,
        name,
        role,
        loading,
        setAuthData,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
