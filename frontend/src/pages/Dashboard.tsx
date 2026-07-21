import { 
  Zap, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertOctagon, 
  Activity, 
  CheckCircle,
  Clock,
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

// Custom Tooltip component for Recharts to match the dark glassmorphic UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-3 rounded-lg shadow-2xl space-y-1">
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="text-sm font-bold" style={{ color: p.color || p.fill }}>
            {p.name}: {p.value} {p.unit || ''}
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
      <div className="flex justify-center items-center h-[50vh] text-red-500 font-bold text-xl">
        Error loading backend data: {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Get efficiency grade letter based on numerical score
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

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500/10 border border-rose-500/30 text-rose-400';
      case 'warning': return 'bg-amber-500/10 border border-amber-500/30 text-amber-400';
      default: return 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Telemetry Dashboard
          </h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Real-time energy load metrics, appliance controls, and network summaries.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-lg p-2 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          <Calendar size={12} className="text-[#1a2a3a]" />
          <span>Updates: Live (15m Interval)</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        
        {/* KPI 1: Current Power */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Load</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <Activity size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {summary.currentPower.toFixed(2)} <span className="text-xs font-semibold text-slate-500">kW</span>
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 mt-2">
            <TrendingDown size={11} />
            <span>-4.2% vs peak</span>
          </div>
        </Card>

        {/* KPI 2: Today's Usage */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <Zap size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {summary.dailyUsage} <span className="text-xs font-semibold text-slate-500">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 mt-2">
            <TrendingDown size={11} />
            <span>-1.5% vs average</span>
          </div>
        </Card>

        {/* KPI 3: Monthly Usage */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">This Month</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <Calendar size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {summary.monthlyUsage} <span className="text-xs font-semibold text-slate-500">kWh</span>
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-rose-800 mt-2">
            <TrendingUp size={11} />
            <span>+2.8% vs last month</span>
          </div>
        </Card>

        {/* KPI 4: Estimated Bill */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Est. Bill</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <DollarSign size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            ₹{summary.estimatedBill.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 mt-2">
            <span>Rate: ₹8.00/kWh</span>
          </div>
        </Card>

        {/* KPI 5: Active Devices */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <Cpu size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {summary.activeDevices} <span className="text-xs font-semibold text-slate-500">/ {devices.length}</span>
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 mt-2">
            <span>Online sensor grid</span>
          </div>
        </Card>

        {/* KPI 6: Efficiency Score */}
        <Card hoverEffect={true} className="lg:col-span-1 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Efficiency</span>
            <div className="p-1 rounded bg-slate-100 border-2 border-slate-900 text-slate-800">
              <CheckCircle size={12} />
            </div>
          </div>
          <p className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {summary.efficiencyScore}% <span className="text-xs font-bold text-[#c5a059]">({getEfficiencyGrade(summary.efficiencyScore || 85)})</span>
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 mt-2">
            <TrendingUp size={11} />
            <span>Optimized today</span>
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
                <CardTitle>Live Power Profile</CardTitle>
                <CardDescription>Real-time load demand across today's telemetry cycle</CardDescription>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1a2a3a] px-2.5 py-1 bg-rose-50 border-2 border-slate-900 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a2a3a]" />
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_TELEMETRY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="activePower" 
                  name="Active Power" 
                  stroke="#1a2a3a" 
                  strokeWidth={2} 
                  dot={{ r: 3, stroke: '#ffffff', strokeWidth: 1, fill: '#1a2a3a' }}
                  activeDot={{ r: 4, stroke: '#1a2a3a', strokeWidth: 1.5, fill: '#ffffff' }}
                  unit=" kW"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Analysis (Bar Chart) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Profile</CardTitle>
            <CardDescription>Consumption versus solar offsets</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_USAGE} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Bar dataKey="usage" name="Consumption" fill="#1a2a3a" stroke="transparent" radius={[4, 4, 0, 0]} unit=" kWh" />
                <Bar dataKey="solar" name="Solar Gen" fill="#c5a059" stroke="transparent" radius={[4, 4, 0, 0]} unit=" kWh" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Grid of Details: Active Alerts & Device Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Appliances Consumption Ranking */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appliance Telemetry Grid</CardTitle>
              <CardDescription>Highest active consumer loads first</CardDescription>
            </div>
            <Link to="/devices" className="text-xs text-[#c5a059] hover:text-[#b08c45] font-bold uppercase tracking-wider flex items-center gap-1 group">
              Manage Devices
              <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topDevices.map((device) => {
              const pctOfRated = device.powerDraw > 0 ? (device.powerDraw / device.powerDraw) * 100 : 0;
              return (
                <div key={device.id} className="p-3 bg-[#faf9f5] border-2 border-slate-900 rounded-xl flex items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleDeviceStatus(device.id)}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]
                        ${device.status === 'online' 
                          ? 'bg-[#1a2a3a] border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-[#25394e]' 
                          : device.status === 'offline'
                            ? 'bg-amber-100 border-slate-900 text-amber-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                            : 'bg-white border-slate-300 text-slate-400'
                        }
                      `}
                    >
                      <Zap size={15} />
                    </button>
                    <div className="text-left">
                      <h4 className="text-sm font-bold font-serif text-slate-900 leading-tight">{device.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{device.roomId} • {device.type}</p>
                    </div>
                  </div>
                  
                  {/* Energy Bar Load */}
                  <div className="hidden sm:block flex-1 max-w-[200px] text-left">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <span>Rated: {Number(device.powerDraw).toFixed(1)}W</span>
                      <span>{Math.round(pctOfRated)}% load</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-md overflow-hidden border-2 border-slate-900">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          device.status === 'online' ? 'bg-[#c5a059]' : 'bg-slate-200'
                        }`} 
                        style={{ width: `${device.status === 'online' ? Math.max(10, Math.min(100, pctOfRated)) : 0}%` }} 
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 font-serif">
                      {Number(device.powerDraw).toFixed(1)} <span className="text-[10px] font-normal text-slate-500 font-sans">W</span>
                    </p>
                    <span className={`inline-block text-[8px] uppercase font-bold tracking-wider rounded-md px-1.5 py-0.5 mt-1 border-2
                      ${device.status === 'online' 
                        ? 'bg-emerald-50 border-emerald-900 text-emerald-900' 
                        : device.status === 'offline'
                          ? 'bg-amber-50 border-amber-900 text-amber-900'
                          : 'bg-white border-slate-400 text-slate-500'
                      }
                    `}>
                      {device.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Active Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest monitoring notifications</CardDescription>
            </div>
            <Link to="/alerts" className="text-xs text-[#c5a059] hover:text-[#b08c45] font-bold uppercase tracking-wider">
              History
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <CheckCircle size={28} className="text-emerald-900 text-emerald-800 animate-bounce" />
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">System fully nominal</p>
                <p className="text-[10px] text-slate-500">No active grid warnings or alerts.</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-xl border-2 flex gap-3 text-xs leading-normal ${getSeverityBadgeClass(alert.severity as any)}`}
                >
                  <AlertOctagon size={16} className="shrink-0 mt-0.5" />
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between font-bold">
                      <span>{alert.message}</span>
                      <span className="opacity-60 text-[9px] font-normal flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="opacity-95 leading-relaxed text-[10px]">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
