import type { User } from '../types';
import api from './api';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    const { token, name, email: resEmail } = response.data;
    
    // Convert to User type
    const user: User = {
      id: resEmail, // using email as ID for frontend
      name: name,
      email: resEmail,
    };
    
    return { token, user };
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, name: resName, email: resEmail } = response.data;
    
    const user: User = {
      id: resEmail,
      name: resName,
      email: resEmail,
    };
    
    return { token, user };
  },
  
  logout: async (): Promise<void> => {
    // In JWT, logout is usually just deleting the token client-side
    return Promise.resolve();
  },

  updateProfile: async (name: string, email: string): Promise<User> => {
    // Mocked for now as backend doesn't have an update profile endpoint yet
    return Promise.resolve({
      id: email,
      name,
      email
    });
  }
};
