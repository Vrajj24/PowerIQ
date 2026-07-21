import type { DashboardSummary } from '../types';
import api from './api';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    const data = response.data;
    
    return {
      currentPower: data.currentPowerDraw,
      dailyUsage: data.dailyUsageKwh,
      monthlyUsage: data.monthlyUsageKwh,
      estimatedBill: data.estimatedBill,
      activeDevices: data.activeDevices,
      totalDevices: data.totalDevices
    };
  }
};
