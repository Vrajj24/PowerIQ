import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { reportService } from '../services/reportService';
import { analyticsService } from '../services/analyticsService';
import { useDevices } from '../context/DeviceContext';
import { Button } from '../components/ui/Button';
import { 
  FileText, 
  Download, 
  Zap,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [isExporting, setIsExporting] = useState(false);
  const { summary, devices } = useDevices();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const days = reportType === 'daily' ? 1 : reportType === 'weekly' ? 7 : reportType === 'monthly' ? 30 : 365;
        const data = await analyticsService.getHistoricalData(days);
        const formatted = data.map(d => ({
          name: new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
          usage: d.powerDraw
        }));
        setChartData(formatted);
      } catch (e) {
        console.error('Failed to fetch historical data for reports', e);
      }
    };
    fetchHistorical();
  }, [reportType]);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const days = reportType === 'daily' ? 1 : reportType === 'weekly' ? 7 : reportType === 'monthly' ? 30 : 365;
      await reportService.downloadCsv(days);
    } catch (error) {
      console.error('Failed to export CSV', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Telemetry Reports</h1>
          <p className="text-slate-400 text-xs mt-0.5">Generate exportable utility reports, appliance summaries, and audit logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCsv}
            isLoading={isExporting}
            className="flex items-center gap-2 text-xs"
          >
            <Download size={14} />
            <span>Export CSV Data</span>
          </Button>
        </div>
      </div>

      {/* Interval Selector */}
      <div className="flex bg-[#121824] border border-[#1e293b] rounded-xl p-1.5 w-fit">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              reportType === type 
                ? 'bg-[#1e293b] text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type} Report
          </button>
        ))}
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="p-4 bg-[#121824]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Aggregated Energy</span>
            <Zap size={15} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            {summary?.monthlyUsage || 480} <span className="text-xs font-sans text-slate-400">kWh</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Total grid draw for interval</p>
        </Card>

        <Card className="p-4 bg-[#121824]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Calculated Cost</span>
            <FileText size={15} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            ₹{summary?.estimatedBill?.toFixed(2) || '3,840.00'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Based on ₹8.00/kWh tariff model</p>
        </Card>

        <Card className="p-4 bg-[#121824]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Device Scope</span>
            <BarChart3 size={15} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            {devices.length} <span className="text-xs font-sans text-slate-400">appliances</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Active sensors reporting telemetry</p>
        </Card>

      </div>

      {/* Chart Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Interval Power Breakdown</CardTitle>
          <CardDescription>Telemetry consumption trend for {reportType} report scope</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0d121d', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Bar dataKey="usage" name="Power Consumption" fill="#38bdf8" radius={[4, 4, 0, 0]} unit=" kW" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appliance Breakdown Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appliance Audit Table</CardTitle>
          <CardDescription>Individual device consumption summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d121d] border-b border-[#1e293b] text-slate-400 uppercase font-medium">
                <tr>
                  <th className="p-3">Appliance</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Rated Power</th>
                  <th className="p-3">Est. Monthly Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-slate-200">
                {devices.map(d => {
                  const estMonthly = Math.round((d.powerDraw * 8 * 30 * 8.0) / 1000);
                  return (
                    <tr key={d.id} className="hover:bg-[#182236] transition-colors">
                      <td className="p-3 font-semibold text-slate-100">{d.name}</td>
                      <td className="p-3 text-slate-300">{d.roomId}</td>
                      <td className="p-3 font-mono text-slate-400 text-[11px]">{d.type}</td>
                      <td className="p-3 font-mono font-bold text-slate-100">{d.powerDraw} W</td>
                      <td className="p-3 font-mono text-slate-200">₹{estMonthly.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
