import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for existing session
    const authStatus = localStorage.getItem('poweriq_auth') === 'true';
    const savedUser = localStorage.getItem('poweriq_user');
    
    if (authStatus && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('poweriq_auth');
        localStorage.removeItem('poweriq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('poweriq_auth', 'true');
      localStorage.setItem('poweriq_user', JSON.stringify(res.user));
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const newUser: User = { id: `usr_${Date.now()}`, name, email };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('poweriq_auth', 'true');
    localStorage.setItem('poweriq_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('poweriq_auth');
    localStorage.removeItem('poweriq_user');
    setIsLoading(false);
  };

  const updateUser = async (name: string, email: string) => {
    if (user) {
      const updatedUser = await authService.updateProfile(name, email);
      setUser(updatedUser);
      localStorage.setItem('poweriq_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }}>
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
