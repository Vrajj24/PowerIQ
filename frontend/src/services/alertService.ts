import type { Alert } from '../types';
import api from './api';

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await api.get('/alerts');
    const data = response.data.value || response.data;
    return data.map((item: any) => ({
      id: item.id.toString(),
      type: item.type.toLowerCase() === 'critical' ? 'critical' : item.type.toLowerCase() === 'warning' ? 'warning' : 'info',
      message: item.message,
      timestamp: item.createdAt,
      read: item.read,
      deviceId: item.deviceName
    }));
  },

  markAsRead: async (_alertId: string): Promise<boolean> => {
    // The backend might not have this endpoint implemented yet
    // For now we simulate success
    return Promise.resolve(true);
  },
  
  dismissAlert: async (_alertId: string): Promise<boolean> => {
    // Same here
    return Promise.resolve(true);
  }
};
