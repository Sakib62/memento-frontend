import { createContext } from 'react';
import { AuthContextType } from '../types/authContext';

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
