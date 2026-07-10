import type { Alert } from '../types';
import { INITIAL_ALERTS } from '../mock';
import { simulateDelay } from './api';

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    const saved = localStorage.getItem('poweriq_alerts');
    const alerts = saved ? JSON.parse(saved) : INITIAL_ALERTS;
    return simulateDelay(alerts);
  },

  updateAlerts: async (alerts: Alert[]): Promise<Alert[]> => {
    localStorage.setItem('poweriq_alerts', JSON.stringify(alerts));
    return simulateDelay(alerts, 200);
  }
};
