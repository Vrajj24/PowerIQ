import type { DashboardSummary } from '../types';
import api from './api';
import { isLocalSession, mockAccountStore } from './mockAccountStore';
export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    if (isLocalSession()) return mockAccountStore.summary();
    const { data } = await api.get('/dashboard/summary');
    if (!data) throw new Error('Invalid summary response');
    return { currentPower: data.currentPowerDraw ?? 0, dailyUsage: data.dailyUsageKwh ?? 0,
      monthlyUsage: data.monthlyUsageKwh ?? 0, estimatedBill: data.estimatedBill ?? 0,
      activeDevices: data.activeDevices ?? 0, totalDevices: data.totalDevices ?? 0 };
  },
};
