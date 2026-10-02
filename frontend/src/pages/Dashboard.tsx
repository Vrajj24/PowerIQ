import {
  Zap,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useDevices } from '../context/DeviceContext';
import TelemetryEmpty from '../components/TelemetryEmpty';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-line p-3 rounded-sm shadow-sm space-y-1 text-xs">
        <p className="font-semibold text-muted">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="font-medium text-ink">
            {p.name}: <span className="font-mono">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} {p.unit || ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { devices, alerts, summary, history, toggleDeviceStatus, error } = useDevices();

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center">
        <div className="w-10 h-10 border-2 border-line border-t-slate-200 rounded-full animate-spin" />
        <div>
          <p className="font-medium text-ink text-sm">Unable to load your account data.</p>
          <p className="text-muted text-xs mt-1 max-w-xs">{error}</p>
        </div>
        <button onClick={() => window.location.reload()} className="text-xs text-ink underline font-medium">Force Refresh</button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center">
        <div className="w-8 h-8 border-2 border-line border-t-slate-200 rounded-full animate-spin" />
        <p className="text-muted text-xs font-medium">Loading telemetry pipeline...</p>
      </div>
    );
  }

  const getEfficiencyGrade = (score: number) => {
    if (score >= 93) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const activeAlerts = alerts.filter(a => !a.read);
  const sortedDevices = [...devices].sort((a, b) => b.powerDraw - a.powerDraw);
  const topDevices = sortedDevices.slice(0, 4);
  const hourlyTelemetry = history.filter(r => Date.parse(r.timestamp) >= Date.now() - 86400000).map(r => ({ timestamp: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), activePower: r.powerDraw }));
  const dailyBuckets: Record<string, number[]> = {};
  history.filter(r => Date.parse(r.timestamp) >= Date.now() - 7 * 86400000).forEach(r => {
    const day = new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    (dailyBuckets[day] ??= []).push(r.powerDraw);
  });
  const weeklyUsage = Object.entries(dailyBuckets).map(([day, values]) => ({ day, usage: values.reduce((sum, v) => sum + v, 0) / values.length * 24 * 0.6 }));

  return (
    <div className="space-y-6 font-sans">

      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            Your energy overview
          </h1>
          <p className="text-muted text-xs mt-0.5">
            See what your home is using. Find the patterns. Make every watt count.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-line rounded-sm px-3 py-1.5 text-xs text-muted">
          <Calendar size={13} className="text-ink" />
          <span>Simulated readings · every 5 seconds</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

        {/* KPI 1: Current Power */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Live Load</span>
            <Activity size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            {summary.currentPower.toFixed(2)} <span className="text-xs font-normal text-muted font-sans">kW</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2">
            <TrendingDown size={12} />
            <span>Online appliances only</span>
          </div>
        </Card>

        {/* KPI 2: Today's Usage */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Today</span>
            <Zap size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            {Number(summary.dailyUsage).toFixed(2)} <span className="text-xs font-normal text-muted font-sans">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2">
            <TrendingDown size={12} />
            <span>Simulated estimate</span>
          </div>
        </Card>

        {/* KPI 3: Monthly Usage */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">This Month</span>
            <Calendar size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            {Number(summary.monthlyUsage).toFixed(2)} <span className="text-xs font-normal text-muted font-sans">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-muted mt-2">
            <TrendingUp size={12} className="text-amber-700" />
            <span>Simulated estimate</span>
          </div>
        </Card>

        {/* KPI 4: Estimated Bill */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Est. Bill</span>
            <DollarSign size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            ₹{summary.estimatedBill.toFixed(2)}
          </p>
          <div className="text-[11px] text-muted mt-2">
            Rate: ₹8.00/kWh
          </div>
        </Card>

        {/* KPI 5: Active Devices */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active</span>
            <Cpu size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            {summary.activeDevices} <span className="text-xs font-normal text-muted font-sans">/ {devices.length}</span>
          </p>
          <div className="text-[11px] text-muted mt-2">
            Sensors online
          </div>
        </Card>

        {/* KPI 6: Efficiency Score */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Efficiency</span>
            <CheckCircle size={14} className="text-ink" />
          </div>
          <p className="text-2xl font-bold font-mono text-ink tracking-tight">
            {devices.length ? `${summary.efficiencyScore}%` : "—"} <span className="text-xs font-medium text-ink">{devices.length ? `(${getEfficiencyGrade(summary.efficiencyScore || 85)})` : ""}</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2">
            <TrendingUp size={12} />
            <span>{devices.length ? "Simulated score" : "Add a device to get started"}</span>
          </div>
        </Card>

      </div>

      {/* Charts Visualization Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Consumption (Line Chart) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Live Power Load</CardTitle>
                <CardDescription>Simulated load from your connected appliances</CardDescription>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink px-2.5 py-1 bg-[#fbe4d7] border border-[#efb599] rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-pulse-subtle" />
                Simulated
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            {history.length ? <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTelemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d5d7ca" opacity={0.6} />
                <XAxis dataKey="timestamp" stroke="#69715f" fontSize={11} tickLine={false} />
                <YAxis stroke="#69715f" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="activePower"
                  name="Active Power"
                  stroke="#d64b23"
                  strokeWidth={2}
                  dot={{ r: 3, stroke: '#efeee4', strokeWidth: 1, fill: '#d64b23' }}
                  activeDot={{ r: 4, stroke: '#d64b23', strokeWidth: 1.5, fill: '#ffffff' }}
                  unit=" kW"
                />
              </LineChart>
            </ResponsiveContainer> : <TelemetryEmpty hasDevices={devices.length > 0} />}
          </CardContent>
        </Card>

        {/* Weekly Analysis (Bar Chart) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Daily power consumption (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {history.length ? <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyUsage} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d5d7ca" opacity={0.6} />
                <XAxis dataKey="day" stroke="#69715f" fontSize={11} tickLine={false} />
                <YAxis stroke="#69715f" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', color: '#69715f' }} />
                <Bar dataKey="usage" name="Consumption" fill="#d64b23" radius={[3, 3, 0, 0]} unit=" kWh" />
              </BarChart>
            </ResponsiveContainer> : <TelemetryEmpty hasDevices={devices.length > 0} />}
          </CardContent>
        </Card>

      </div>

      {/* Grid of Details: Active Devices & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Appliances Ranking */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appliance Telemetry Grid</CardTitle>
              <CardDescription>Highest active consumer loads first</CardDescription>
            </div>
            <Link to="/devices" className="text-xs text-ink hover:text-ink font-medium flex items-center gap-1 group">
              Manage Devices
              <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDevices.length === 0 && <TelemetryEmpty />}
            {topDevices.map((device) => (
              <div key={device.id} className="p-3 bg-paper border border-line rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { void toggleDeviceStatus(device.id).catch(() => {}); }}
                    className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all ${
                      device.status === 'online'
                        ? 'bg-surface-muted border-line text-ink'
                        : 'bg-paper border-line text-muted hover:text-ink'
                    }`}
                  >
                    <Zap size={14} />
                  </button>
                  <div className="text-left">
                    <h4 className="text-xs font-semibold text-ink">{device.name}</h4>
                    <p className="text-[10px] text-muted font-mono mt-0.5">{device.roomId} • {device.type}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-ink">
                    {Number(device.powerDraw).toFixed(1)} <span className="text-[10px] font-normal text-muted">W</span>
                  </p>
                  <span className={`inline-block text-[10px] font-medium rounded px-1.5 py-0.5 mt-0.5 border ${
                    device.status === 'online'
                      ? 'bg-emerald-100/40 border-emerald-200/60 text-emerald-700'
                      : 'bg-surface-muted border-line text-muted'
                  }`}>
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Active Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest monitoring notifications</CardDescription>
            </div>
            <Link to="/alerts" className="text-xs text-muted hover:text-ink font-medium">
              History
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <CheckCircle size={24} className="text-emerald-700" />
                <p className="text-xs font-semibold text-ink">System Nominal</p>
                <p className="text-[11px] text-muted">No active grid warnings or alerts.</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-sm border border-line bg-paper space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-ink">
                    <span>{alert.title || 'Telemetry Alert'}</span>
                    <span className="opacity-50 text-[10px] font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-muted text-[11px] leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
