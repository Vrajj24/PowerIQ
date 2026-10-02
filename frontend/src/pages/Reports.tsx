import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { reportService } from '../services/reportService';
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

// Aggregate raw telemetry readings into buckets based on report type
function aggregateData(raw: any[], reportType: ReportType): { name: string; usage: number }[] {
  if (!raw || raw.length === 0) return [];

  const buckets: Record<string, number[]> = {};

  raw.forEach((d: any, index: number) => {
    const date = new Date(d.timestamp);
    let key = '';

    switch (reportType) {
      case 'daily':
        // Group by hour
        key = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        break;
      case 'weekly':
        // Group by day of week
        key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        break;
      case 'monthly':
        // Group by month (e.g., Jan '26)
        key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        break;
      case 'yearly':
        // Group by year (e.g., 2025)
        key = date.getFullYear().toString();
        break;
    }

    if (!buckets[key]) buckets[key] = [];
    const next = raw[index + 1];
    const hours = next ? Math.max(0, (Date.parse(next.timestamp) - date.getTime()) / 3600000) : 0;
    buckets[key].push((d.powerDraw || 0) * Math.min(hours, 1));
  });

    const aggregated = Object.entries(buckets).map(([name, values]) => ({
      name,
      usage: Number((values.reduce((sum, v) => sum + v, 0)).toFixed(2))
    }));

    // Sort chronologically
    const sorted = aggregated.sort((a, b) => {
      if (reportType === 'monthly') {
        const [mA, yA] = a.name.split(' ');
        const [mB, yB] = b.name.split(' ');
        const dateA = new Date(`${mA} 1, 20${yA.replace("'", "")}`);
        const dateB = new Date(`${mB} 1, 20${yB.replace("'", "")}`);
        return dateA.getTime() - dateB.getTime();
      } else if (reportType === 'yearly') {
        return parseInt(a.name) - parseInt(b.name);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    return sorted;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-line p-3 rounded-sm shadow-sm space-y-1 text-xs">
        <p className="font-semibold text-muted">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="font-medium text-ink">
            {p.name}: <span className="font-mono font-bold">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} {p.unit || ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [isExporting, setIsExporting] = useState(false);
  const { devices, history } = useDevices();
  const days = reportType === 'daily' ? 1 : reportType === 'weekly' ? 7 : reportType === 'monthly' ? 365 : 365 * 3;
  const chartData = devices.length ? aggregateData(history.filter(r => Date.parse(r.timestamp) >= Date.now() - days * 86400000), reportType) : [];

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const days = reportType === 'daily' ? 1 : reportType === 'weekly' ? 7 : reportType === 'monthly' ? 365 : 365 * 3;
      await reportService.downloadCsv(days);
    } catch (error) {
      console.error('Failed to export CSV', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate aggregated energy from chart data
  const totalEnergy = chartData.reduce((sum, d) => sum + (d.usage || 0), 0);

  // Dynamic multiplier for cost based on report type
  const estimatedCost = Number((totalEnergy * 8).toFixed(2));

  return (
    <div className="space-y-6 font-sans text-left">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Your energy, on record</h1>
          <p className="text-muted text-xs mt-0.5">Generate exportable utility reports, appliance summaries, and audit logs.</p>
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
      <div className="grid grid-cols-2 sm:flex bg-surface border border-line rounded-sm p-1.5 w-full sm:w-fit">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-1.5 rounded-sm text-xs font-medium capitalize transition-all ${
              reportType === type
                ? 'bg-line text-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            {type} Report
          </button>
        ))}
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Aggregated Energy</span>
            <Zap size={15} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink">
            {totalEnergy.toFixed(2)} <span className="text-xs font-sans text-muted">kWh</span>
          </p>
          <p className="text-[11px] text-muted mt-2">Total grid draw for {reportType} interval</p>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Calculated Cost</span>
            <FileText size={15} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink">
            ₹{estimatedCost.toFixed(2)}
          </p>
          <p className="text-[11px] text-muted mt-2">Based on ₹8.00/kWh tariff model</p>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Device Scope</span>
            <BarChart3 size={15} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink">
            {devices.length} <span className="text-xs font-sans text-muted">appliances</span>
          </p>
          <p className="text-[11px] text-muted mt-2">Active sensors reporting telemetry</p>
        </Card>

      </div>

      {/* Chart Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Interval Power Breakdown</CardTitle>
          <CardDescription>Telemetry consumption trend for {reportType} report scope</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d5d7ca" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#69715f"
                  fontSize={11}
                  tickLine={false}
                  interval={chartData.length > 15 ? Math.floor(chartData.length / 12) : 0}
                  angle={chartData.length > 10 ? -35 : 0}
                  textAnchor={chartData.length > 10 ? 'end' : 'middle'}
                  height={chartData.length > 10 ? 60 : 30}
                />
                <YAxis stroke="#69715f" fontSize={11} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="usage" name="Power Consumption" fill="#d64b23" radius={[4, 4, 0, 0]} unit=" kWh" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-xs">
              <p>No telemetry data available for this interval.</p>
            </div>
          )}
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
              <thead className="bg-paper border-b border-line text-muted uppercase font-medium">
                <tr>
                  <th className="p-3">Appliance</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Rated Power</th>
                  <th className="p-3">Est. Monthly Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {devices.map(d => {
                  const estMonthly = d.status === "online" ? Math.round((d.powerDraw * 24 * 0.6 * 30 * 8.0) / 1000) : 0;
                  return (
                    <tr key={d.id} className="hover:bg-surface-muted transition-colors">
                      <td className="p-3 font-semibold text-ink">{d.name}</td>
                      <td className="p-3 text-ink">{d.roomId}</td>
                      <td className="p-3 font-mono text-muted text-[11px]">{d.type}</td>
                      <td className="p-3 font-mono font-bold text-ink">{Number(d.powerDraw).toFixed(2)} W</td>
                      <td className="p-3 font-mono text-ink">₹{estMonthly.toLocaleString()}</td>
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
