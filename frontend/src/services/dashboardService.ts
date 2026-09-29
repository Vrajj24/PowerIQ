import type { DashboardSummary } from '../types';
import api from './api';
import { MOCK_SUMMARY } from '../mock';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await api.get('/dashboard/summary');
      const data = response.data;
      if (!data) return MOCK_SUMMARY as any;
      
      return {
        currentPower: data.currentPowerDraw ?? 3.93,
        dailyUsage: data.dailyUsageKwh ?? 26.4,
        monthlyUsage: data.monthlyUsageKwh ?? 980,
        estimatedBill: data.estimatedBill ?? 7840.00,
        activeDevices: data.activeDevices ?? 5,
        totalDevices: data.totalDevices ?? 8
      };
    } catch (e) {
      console.warn('Backend /dashboard/summary endpoint unavailable, using fallback summary:', e);
      return MOCK_SUMMARY as any;
    }
  }
};
