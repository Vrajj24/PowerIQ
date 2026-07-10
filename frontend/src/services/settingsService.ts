import { simulateDelay } from './api';

export const settingsService = {
  getSettings: async (): Promise<any> => {
    const saved = localStorage.getItem('poweriq_settings');
    const settings = saved ? JSON.parse(saved) : {
      landingPage: 'dashboard',
      timeRange: 'monthly',
      theme: 'system',
      emailNotifs: true,
      pushNotifs: true,
      alertThreshold: 'warning',
      costPerUnit: 8.00,
      currency: 'INR',
      powerLimit: 5.5
    };
    return simulateDelay(settings);
  },

  updateSettings: async (settings: any): Promise<any> => {
    localStorage.setItem('poweriq_settings', JSON.stringify(settings));
    return simulateDelay(settings, 200);
  }
};
