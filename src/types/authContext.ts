export interface AuthContextType {
  token: string | null;
  id: string | null;
  username: string | null;
  name: string | null;
  role: number | null;
  loading: boolean;
  setAuthData: (token: string) => void;
  clearAuthData: () => void;
}
