import type { Alert } from '../types';
import api from './api';
import { INITIAL_ALERTS } from '../mock';

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await api.get('/alerts');
      const data = response.data?.value || response.data;
      if (!Array.isArray(data)) {
        return INITIAL_ALERTS;
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
    } catch (e) {
      console.warn('Backend /alerts endpoint unavailable, using mock alerts:', e);
      return INITIAL_ALERTS;
    }
  },

  markAsRead: async (_alertId: string): Promise<boolean> => {
    return Promise.resolve(true);
  },
  
  dismissAlert: async (_alertId: string): Promise<boolean> => {
    return Promise.resolve(true);
  }
};
