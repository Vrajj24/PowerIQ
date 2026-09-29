import type { User } from '../types';
import api from './api';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, name, email: resEmail } = response.data;
      
      const user: User = {
        id: resEmail || email,
        name: name || email.split('@')[0],
        email: resEmail || email,
      };
      
      return { token, user };
    } catch (error: any) {
      if (error?.response) {
        const errorData = error.response.data;
        const msg = typeof errorData === 'string' 
          ? errorData 
          : (errorData?.message || errorData?.error || 'Invalid email or password. Please try again.');
        throw new Error(msg);
      }

      console.warn('Backend login unavailable, creating local session:', error);
      const mockToken = 'jwt_token_' + Date.now();
      const userName = email.split('@')[0].replace('.', ' ');
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      const mockUser: User = {
        id: email,
        name: formattedName,
        email: email,
      };
      return { token: mockToken, user: mockUser };
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, name: resName, email: resEmail } = response.data;
      
      const user: User = {
        id: resEmail || email,
        name: resName || name,
        email: resEmail || email,
      };
      
      return { token, user };
    } catch (error: any) {
      if (error?.response) {
        const errorData = error.response.data;
        const msg = typeof errorData === 'string' 
          ? errorData 
          : (errorData?.message || errorData?.error || 'Registration failed. Email may already be in use.');
        throw new Error(msg);
      }

      console.warn('Backend registration endpoint unavailable, creating local session:', error);
      const mockToken = 'jwt_token_' + Date.now();
      const mockUser: User = {
        id: email,
        name: name || email.split('@')[0],
        email: email,
      };
      return { token: mockToken, user: mockUser };
    }
  },
  
  logout: async (): Promise<void> => {
    return Promise.resolve();
  },

  updateProfile: async (name: string, email: string): Promise<User> => {
    return Promise.resolve({
      id: email,
      name,
      email
    });
  }
};
