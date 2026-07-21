import type { AnalyticsData } from '../types';
import api from './api';

export const analyticsService = {
  getHistoricalData: async (days: number = 7): Promise<AnalyticsData[]> => {
    const response = await api.get(`/analytics/historical?days=${days}`);
    
    return response.data.map((item: any) => ({
      timestamp: item.timestamp, // Ensure the backend sends ISO format
      powerDraw: item.powerDraw,
      activeDevices: item.activeDevices
    }));
  }
};
