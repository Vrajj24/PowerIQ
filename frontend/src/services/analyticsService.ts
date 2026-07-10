import { ROOM_DISTRIBUTION, MONTHLY_USAGE, PEAK_HOURS_DATA } from '../mock';
import { simulateDelay } from './api';

export const analyticsService = {
  getRoomDistribution: async (): Promise<any[]> => {
    return simulateDelay(ROOM_DISTRIBUTION);
  },

  getMonthlyUsage: async (): Promise<any[]> => {
    return simulateDelay(MONTHLY_USAGE);
  },

  getPeakHours: async (): Promise<any[]> => {
    return simulateDelay(PEAK_HOURS_DATA);
  }
};
