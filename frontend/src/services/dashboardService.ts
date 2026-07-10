import type { UsageSummary, TelemetryPoint } from '../types';
import { MOCK_SUMMARY, HOURLY_TELEMETRY, WEEKLY_USAGE } from '../mock';
import { simulateDelay } from './api';

export const dashboardService = {
  getSummary: async (): Promise<UsageSummary> => {
    return simulateDelay(MOCK_SUMMARY);
  },

  getTelemetry: async (): Promise<TelemetryPoint[]> => {
    return simulateDelay(HOURLY_TELEMETRY);
  },

  getWeeklyUsage: async (): Promise<any[]> => {
    return simulateDelay(WEEKLY_USAGE);
  }
};
