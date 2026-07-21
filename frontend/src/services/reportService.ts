import api from './api';

export const reportService = {
  downloadCsv: async (days: number = 7) => {
    const response = await api.get(`/reports/download/csv?days=${days}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `power_usage_report_${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
