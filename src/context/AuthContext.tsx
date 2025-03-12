import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  username: string | null;
  name: string | null;
  role: string | null;
  loading: boolean;
  setAuthData: (token: string) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: {
          username: string;
          name: string;
          role: string;
          exp?: number;
        } = jwtDecode(token);

        const expiryTime = decoded.exp ? decoded.exp * 1000 : 0;
        if (Date.now() >= expiryTime) {
          clearAuthData();
        } else {
          setToken(token);
          setUsername(decoded.username);
          setName(decoded.name);
          setRole(decoded.role);
        }
      } catch (error) {
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const setAuthData = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: { username: string; name: string; role: string } =
      jwtDecode(token);
    setToken(token);
    setUsername(decoded.username);
    setName(decoded.name);
    setRole(decoded.role);
  };

  const clearAuthData = () => {
    setToken(null);
    setUsername(null);
    setName(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
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

export { AuthContext, AuthProvider };
