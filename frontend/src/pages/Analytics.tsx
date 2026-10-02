import { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import {
  Lightbulb,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import TelemetryEmpty from '../components/TelemetryEmpty';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-line p-3 rounded-sm shadow-sm space-y-1 text-xs">
        <p className="font-semibold text-muted">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 font-medium text-ink">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span>{p.name}: <span className="font-mono font-bold">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}{p.unit || ''}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CHART_COLORS = ['#d64b23', '#54765b', '#8b7eaa', '#c19a38', '#bd755c', '#69715f'];

export default function Analytics() {
  const { devices, summary, history } = useDevices();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : 30;
  const chartData = history.filter(r => Date.parse(r.timestamp) >= Date.now() - days * 86400000).map(r => ({
    timestamp: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    day: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    month: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    activePower: r.powerDraw, usage: r.powerDraw,
  }));

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-line border-t-slate-200" />
      </div>
    );
  }

  const roomLoads: { [key: string]: number } = {};
  devices.forEach(d => {
    const room = d.roomId || 'General';
    const draw = d.status === "online" ? d.powerDraw || 0 : 0;
    roomLoads[room] = (roomLoads[room] || 0) + draw;
  });

  const roomData = Object.entries(roomLoads).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(1))
  }));

  const highestDevice = devices.length > 0
    ? devices.reduce((prev, curr) => (prev.powerDraw > curr.powerDraw) ? prev : curr)
    : null;

  return (
    <div className="space-y-6 font-sans text-left">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">The bigger picture</h1>
          <p className="text-muted text-xs mt-0.5">Historical load profiles, room-by-room distribution, and optimization recommendations.</p>
        </div>
        <div className="flex bg-surface border border-line rounded-sm p-1">
          {(['today', '7days', '30days'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-line text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {range === 'today' ? '24 Hours' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Load Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Load Trend Profile</CardTitle>
              <CardDescription>Power consumption history across selected interval</CardDescription>
            </div>
            <span className="text-xs font-mono text-muted bg-paper border border-line px-2.5 py-1 rounded-sm">
              Avg Load: {(summary.currentPower ?? 0).toFixed(2)} kW
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-72">
          {devices.length && history.length ? <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d64b23" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d64b23" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d5d7ca" opacity={0.6} />
              <XAxis dataKey={timeRange === 'today' ? 'timestamp' : timeRange === '7days' ? 'day' : 'month'} stroke="#69715f" fontSize={11} tickLine={false} />
              <YAxis stroke="#69715f" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={timeRange === 'today' ? 'activePower' : 'usage'} name="Power Draw" stroke="#d64b23" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" unit=" kW" />
            </AreaChart>
          </ResponsiveContainer> : <TelemetryEmpty hasDevices={devices.length > 0} />}
        </CardContent>
      </Card>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Room Distribution Pie Chart */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Room Distribution</CardTitle>
            <CardDescription>Wattage share split by location</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {devices.length && history.length ? <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roomData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#69715f' }} />
              </PieChart>
            </ResponsiveContainer> : <TelemetryEmpty hasDevices={devices.length > 0} />}
          </CardContent>
        </Card>

        {/* Dynamic Optimization Insights */}
        <Card className="lg:col-span-7 space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-ink" />
              <CardTitle>Grid Insights & Recommendations</CardTitle>
            </div>
            <CardDescription>Automated anomaly checks and power saving opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">

            {highestDevice && (
              <div className="p-3 bg-paper border border-line rounded-sm flex items-start gap-3">
                <Zap size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-ink">Primary Consumer Highlight</h4>
                  <p className="text-muted text-xs mt-0.5 leading-relaxed">
                    <span className="text-ink font-medium">{highestDevice.name}</span> in <span className="text-ink">{highestDevice.roomId}</span> draws {Number(highestDevice.powerDraw).toFixed(2)}W, contributing ~{highestDevice.status === "online" ? Math.round((highestDevice.powerDraw / (summary.currentPower * 1000 || 1)) * 100) : 0}% of your active load.
                  </p>
                </div>
              </div>
            )}

            {devices.length > 0 && <p className="text-xs text-muted">Simulated readings are based on your {devices.length} registered {devices.length === 1 ? 'appliance' : 'appliances'}. Offline appliances do not contribute to the active load.</p>}
            {devices.length === 0 && <TelemetryEmpty />}

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
