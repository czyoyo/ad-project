import authService from '../services/auth.service.ts';
import { RegisterData, User } from '../types/user.types.ts';
import { createContext, JSX, ReactNode, useContext, useEffect, useState } from 'react';
import { authStorage } from '../utils/localStorage.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>; // RegisterData 타입으로 변경
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(authStorage.getStorageToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authStorage.getStorageToken();
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data', error);
          authStorage.removeStorageToken();
          setTokenState(null);
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
      setTokenState(authToken);
      authStorage.setStorageToken(authToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    // RegisterData 타입으로 변경
    setIsLoading(true);
    try {
      const { user: newUser, token: authToken } = await authService.register(userData);
      setUser(newUser);
      setTokenState(authToken);
      authStorage.setStorageToken(authToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    authStorage.removeStorageToken();
  };

  const refreshToken = async (): Promise<void> => {
    // void 반환 타입 명시
    try {
      const { token: newToken } = await authService.refreshToken();
      setTokenState(newToken);
      authStorage.setStorageToken(newToken);
      // return 문 제거
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
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
