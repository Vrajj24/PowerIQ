import type { Alert } from '../types';
import api from './api';
import { isLocalSession, mockAccountStore } from './mockAccountStore';

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    if (isLocalSession()) return mockAccountStore.alerts();
      const response = await api.get('/alerts');
      const data = response.data?.value || response.data;
      if (!Array.isArray(data)) {
        throw new Error("Invalid alerts response");
      }
      return data.map((item: any) => ({
        id: item.id ? item.id.toString() : `alt_${Math.random()}`,
        type: (item.type || 'info').toLowerCase() === 'critical' ? 'critical' : (item.type || 'info').toLowerCase() === 'warning' ? 'warning' : 'info',
        title: item.title || item.message || 'Notification',
        message: item.message || '',
        timestamp: item.createdAt || new Date().toISOString(),
        read: Boolean(item.read),
        deviceId: item.deviceName
      }));
  },

  markAsRead: async (_alertId: string): Promise<boolean> => {
    return Promise.resolve(true);
  },
  
  dismissAlert: async (_alertId: string): Promise<boolean> => {
    return Promise.resolve(true);
  }
};
