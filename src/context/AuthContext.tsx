import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  id: number | null;
  username: string | null;
  name: string | null;
  role: number | null;
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
  const [id, setId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: {
          id: number;
          username: string;
          name: string;
          role: number;
          exp?: number;
        } = jwtDecode(token);

        const expiryTime = decoded.exp ? decoded.exp * 1000 : 0;
        if (Date.now() >= expiryTime) {
          clearAuthData();
        } else {
          setToken(token);
          setId(decoded.id);
          setUsername(decoded.username);
          setName(decoded.name);
          setRole(decoded.role);
          console.log(decoded.id);
        }
      } catch (error) {
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const setAuthData = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: {
      id: number;
      username: string;
      name: string;
      role: number;
    } = jwtDecode(token);
    setToken(token);
    setId(decoded.id);
    setUsername(decoded.username);
    setName(decoded.name);
    setRole(decoded.role);
    console.log(id);
  };

  const clearAuthData = () => {
    setToken(null);
    setId(null);
    setUsername(null);
    setName(null);
    setRole(null);
    localStorage.removeItem('token');
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

export { AuthContext, AuthProvider };
