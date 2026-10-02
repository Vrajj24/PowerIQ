import api from './api';
import { isLocalSession, mockAccountStore } from './mockAccountStore';

export const reportService = {
  downloadCsv: async (days: number = 7) => {
    const response = isLocalSession() ? { data: ["Timestamp,TotalPowerDraw(kW),ActiveDevices", ...mockAccountStore.history(days).map(r => `${r.timestamp},${r.powerDraw},${r.activeDevices}`)].join("\n") } : await api.get(`/reports/download/csv?days=${days}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `power_usage_report_${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
