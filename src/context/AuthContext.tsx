import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  username: string | null;
  name: string | null;
  role: string | null;
  //tokenExpiration: number | null;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  //const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);

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
          console.error('Token has expired');
          clearAuthData();
        } else {
          setUsername(decoded.username);
          setName(decoded.name);
          setRole(decoded.role);
          //setTokenExpiration(expiryTime);
        }
      } catch (error) {
        console.error('Invalid token');
        clearAuthData();
      }
    }
  }, []);

  const clearAuthData = () => {
    setUsername(null);
    setName(null);
    setRole(null);
    //setTokenExpiration(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ username, name, role, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
