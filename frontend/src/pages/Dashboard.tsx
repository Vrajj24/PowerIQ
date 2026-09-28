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
import { HOURLY_TELEMETRY, WEEKLY_USAGE } from '../mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d121d] border border-[#1e293b] p-3 rounded-lg shadow-xl space-y-1 text-xs">
        <p className="font-semibold text-slate-400">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="font-medium text-slate-200">
            {p.name}: <span className="font-mono">{p.value} {p.unit || ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { devices, alerts, summary, toggleDeviceStatus, error } = useDevices();

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-slate-200 rounded-full animate-spin" />
        <div>
          <p className="font-medium text-slate-200 text-sm">Connecting to backend service...</p>
          <p className="text-slate-400 text-xs mt-1 max-w-xs">Connecting to live API. This usually takes up to 30 seconds on initial boot.</p>
        </div>
        <button onClick={() => window.location.reload()} className="text-xs text-slate-300 underline font-medium">Force Refresh</button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-200 rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-medium">Loading telemetry pipeline...</p>
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

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Telemetry Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time energy load metrics, appliance controls, and network summaries.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#121824] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-400">
          <Calendar size={13} className="text-slate-300" />
          <span>Interval: 15-min Live Stream</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Current Power */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Live Load</span>
            <Activity size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {summary.currentPower.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">kW</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingDown size={12} />
            <span>-4.2% vs peak</span>
          </div>
        </Card>

        {/* KPI 2: Today's Usage */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Today</span>
            <Zap size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {summary.dailyUsage} <span className="text-xs font-normal text-slate-400 font-sans">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingDown size={12} />
            <span>-1.5% vs avg</span>
          </div>
        </Card>

        {/* KPI 3: Monthly Usage */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">This Month</span>
            <Calendar size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {summary.monthlyUsage} <span className="text-xs font-normal text-slate-400 font-sans">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <TrendingUp size={12} className="text-amber-400" />
            <span>+2.8% vs last mo</span>
          </div>
        </Card>

        {/* KPI 4: Estimated Bill */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Est. Bill</span>
            <DollarSign size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            ₹{summary.estimatedBill.toFixed(2)}
          </p>
          <div className="text-[11px] text-slate-400 mt-2">
            Rate: ₹8.00/kWh
          </div>
        </Card>

        {/* KPI 5: Active Devices */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active</span>
            <Cpu size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {summary.activeDevices} <span className="text-xs font-normal text-slate-400 font-sans">/ {devices.length}</span>
          </p>
          <div className="text-[11px] text-slate-400 mt-2">
            Sensors online
          </div>
        </Card>

        {/* KPI 6: Efficiency Score */}
        <Card hoverEffect={true} className="lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Efficiency</span>
            <CheckCircle size={14} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {summary.efficiencyScore}% <span className="text-xs font-medium text-slate-300">({getEfficiencyGrade(summary.efficiencyScore || 85)})</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingUp size={12} />
            <span>Optimal grid state</span>
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
                <CardDescription>Real-time load demand across today's telemetry cycle</CardDescription>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 px-2.5 py-1 bg-[#1a2336] border border-[#2a3650] rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-pulse-subtle" />
                Live Feed
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_TELEMETRY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="activePower" 
                  name="Active Power" 
                  stroke="#38bdf8" 
                  strokeWidth={2} 
                  dot={{ r: 3, stroke: '#0d121d', strokeWidth: 1, fill: '#38bdf8' }}
                  activeDot={{ r: 4, stroke: '#38bdf8', strokeWidth: 1.5, fill: '#ffffff' }}
                  unit=" kW"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Analysis (Bar Chart) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Daily power consumption (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_USAGE} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="usage" name="Consumption" fill="#38bdf8" radius={[3, 3, 0, 0]} unit=" kWh" />
                <Bar dataKey="solar" name="Solar Offset" fill="#059669" radius={[3, 3, 0, 0]} unit=" kWh" />
              </BarChart>
            </ResponsiveContainer>
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
            <Link to="/devices" className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 group">
              Manage Devices
              <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDevices.map((device) => (
              <div key={device.id} className="p-3 bg-[#0d121d] border border-[#1e293b] rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleDeviceStatus(device.id)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                      device.status === 'online' 
                        ? 'bg-[#182236] border-[#2b3a5a] text-slate-100' 
                        : 'bg-[#090d14] border-[#1e293b] text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Zap size={14} />
                  </button>
                  <div className="text-left">
                    <h4 className="text-xs font-semibold text-slate-100">{device.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{device.roomId} • {device.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-slate-100">
                    {Number(device.powerDraw).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">W</span>
                  </p>
                  <span className={`inline-block text-[10px] font-medium rounded px-1.5 py-0.5 mt-0.5 border ${
                    device.status === 'online' 
                      ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
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
            <Link to="/alerts" className="text-xs text-slate-400 hover:text-slate-200 font-medium">
              History
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <CheckCircle size={24} className="text-emerald-400" />
                <p className="text-xs font-semibold text-slate-200">System Nominal</p>
                <p className="text-[11px] text-slate-400">No active grid warnings or alerts.</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-3 rounded-lg border border-[#1e293b] bg-[#0d121d] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-slate-200">
                    <span>{alert.title || 'Telemetry Alert'}</span>
                    <span className="opacity-50 text-[10px] font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
