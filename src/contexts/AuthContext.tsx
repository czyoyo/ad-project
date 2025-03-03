import { User } from '../types/user.types.ts';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/localStorage.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data', error);
          removeStoredToken();
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token: authToken } = await authService.login(email, password);
      setUser(userData);
      setToken(authToken);
      setStoredToken(authToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'>) => {
    setIsLoading(true);
    try {
      const { user: newUser, token: authToken } = await authService.register(userData);
      setUser(newUser);
      setToken(authToken);
      setStoredToken(authToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStoredToken();
  };

  const refreshToken = async () => {
    try {
      const { token: newToken } = await authService.refreshToken();
      setToken(newToken);
      setStoredToken(newToken);
      return newToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
