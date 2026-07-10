import type { User } from '../types';
import { simulateDelay } from './api';

export const authService = {
  login: async (email: string, _password: string): Promise<{ token: string; user: User }> => {
    return simulateDelay({
      token: 'mock_jwt_token_123',
      user: {
        id: 'u1',
        name: 'Jane Doe',
        email,
      }
    });
  },
  
  logout: async (): Promise<void> => {
    return simulateDelay(undefined, 200);
  },

  updateProfile: async (name: string, email: string): Promise<User> => {
    return simulateDelay({
      id: 'u1',
      name,
      email
    });
  }
};
