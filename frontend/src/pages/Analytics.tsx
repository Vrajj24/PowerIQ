import { useState, useEffect } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  TrendingDown, 
  Lightbulb, 
  Activity,
  Zap,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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
import { analyticsService } from '../services/analyticsService';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d121d] border border-[#1e293b] p-3 rounded-lg shadow-xl space-y-1 text-xs">
        <p className="font-semibold text-slate-400">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span>{p.name}: <span className="font-mono font-bold">{p.value}{p.unit || ''}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CHART_COLORS = ['#38bdf8', '#059669', '#818cf8', '#f59e0b', '#ec4899', '#64748b'];

export default function Analytics() {
  const { devices, summary } = useDevices();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : 30;
        const data = await analyticsService.getHistoricalData(days);
        
        let formatted;
        if (timeRange === 'today') {
           formatted = data.map((d: any) => ({
             timestamp: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
             activePower: d.powerDraw
           }));
        } else if (timeRange === '7days') {
           formatted = data.map((d: any) => ({
             day: new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
             usage: d.powerDraw,
             solar: 0 
           }));
        } else {
           formatted = data.map((d: any) => ({
             month: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
             usage: d.powerDraw
           }));
        }
        setChartData(formatted);
      } catch (e) {
        console.error('Failed to fetch historical data', e);
      }
    };
    fetchHistorical();
  }, [timeRange]);

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-700 border-t-slate-200" />
      </div>
    );
  }

  const roomLoads: { [key: string]: number } = {};
  devices.forEach(d => {
    const room = d.roomId || 'General';
    const draw = d.powerDraw || 0;
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
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Energy Analytics</h1>
          <p className="text-slate-400 text-xs mt-0.5">Historical load profiles, room-by-room distribution, and optimization recommendations.</p>
        </div>
        <div className="flex bg-[#121824] border border-[#1e293b] rounded-lg p-1">
          {(['today', '7days', '30days'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                timeRange === range 
                  ? 'bg-[#1e293b] text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
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
            <span className="text-xs font-mono text-slate-400 bg-[#0d121d] border border-[#1e293b] px-2.5 py-1 rounded-md">
              Avg Load: {(summary.currentPower || 2.4).toFixed(2)} kW
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey={timeRange === 'today' ? 'timestamp' : timeRange === '7days' ? 'day' : 'month'} stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={timeRange === 'today' ? 'activePower' : 'usage'} name="Power Draw" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" unit=" kW" />
            </AreaChart>
          </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height="100%">
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
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dynamic Optimization Insights */}
        <Card className="lg:col-span-7 space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-slate-300" />
              <CardTitle>Grid Insights & Recommendations</CardTitle>
            </div>
            <CardDescription>Automated anomaly checks and power saving opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            
            {highestDevice && (
              <div className="p-3 bg-[#0d121d] border border-[#1e293b] rounded-lg flex items-start gap-3">
                <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">Primary Consumer Highlight</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    <span className="text-slate-200 font-medium">{highestDevice.name}</span> in <span className="text-slate-300">{highestDevice.roomId}</span> draws {highestDevice.powerDraw}W, contributing ~{Math.round((highestDevice.powerDraw / (summary.currentPower * 1000 || 1)) * 100)}% of your active load.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 bg-[#0d121d] border border-[#1e293b] rounded-lg flex items-start gap-3">
              <TrendingDown size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-100">Overnight Idle Strategy</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                  Setting standby geysers to auto-timer overnight could save up to <span className="text-slate-200 font-medium">₹320/month</span> on your tariff.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0d121d] border border-[#1e293b] rounded-lg flex items-start gap-3">
              <BarChart2 size={16} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-100">Tariff Optimization</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                  Your average daily grid usage is currently within optimal tier boundaries at ₹8.00/kWh.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
