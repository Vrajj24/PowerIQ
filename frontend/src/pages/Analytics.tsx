import { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  TrendingDown, 
  Lightbulb, 
  AlertCircle
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { HOURLY_TELEMETRY, WEEKLY_USAGE, MONTHLY_USAGE, ROOM_DISTRIBUTION } from '../mock';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-slate-900 p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0" style={{ backgroundColor: p.color || p.fill }} />
            <span>{p.name}: {p.value}{p.unit || ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { devices, summary } = useDevices();

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');

  // Dynamic calculations from context
  const activeDevicesList = devices.filter(d => d.status === 'on');
  
  // Find highest consuming device
  const highestDevice = devices.length > 0 
    ? [...devices].sort((a, b) => b.currentConsumption - a.currentConsumption)[0] 
    : null;

  // Find lowest consuming active device
  const lowestActiveDevice = activeDevicesList.length > 0 
    ? [...activeDevicesList].sort((a, b) => a.currentConsumption - b.currentConsumption)[0] 
    : null;

  // Calculate room-wise distribution dynamically based on current context
  const roomLoads: { [key: string]: number } = {};
  devices.forEach(d => {
    if (d.status === 'on') {
      roomLoads[d.room] = (roomLoads[d.room] || 0) + d.currentConsumption;
    }
  });

  const totalActiveLoad = Object.values(roomLoads).reduce((sum, val) => sum + val, 0);
  
  const dynamicRoomDistribution = Object.entries(roomLoads).map(([name, value], idx) => {
    const colors = ['#c5a059', '#1a2a3a', '#5a7366', '#7c8892', '#8c7d70', '#565960'];
    const percentage = totalActiveLoad > 0 ? Math.round((value / totalActiveLoad) * 100) : 0;
    return {
      name,
      value: percentage,
      wattage: value,
      color: colors[idx % colors.length]
    };
  });

  // Fallback to static mock if no devices are active
  const pieData = dynamicRoomDistribution.length > 0 ? dynamicRoomDistribution : ROOM_DISTRIBUTION;

  // Device comparison data
  const deviceComparisonData = devices.map(d => ({
    name: d.name,
    consumption: d.currentConsumption,
    rated: d.ratedPower
  })).sort((a, b) => b.consumption - a.consumption);

  // Generate dynamic insights text based on load configurations
  const getInsights = () => {
    const list = [];
    
    // Insight 1: Highest consuming device
    if (highestDevice && highestDevice.status === 'on') {
      list.push({
        type: 'warning',
        title: 'High Load Alert',
        desc: `${highestDevice.name} in the ${highestDevice.room} is currently drawing ${highestDevice.currentConsumption}W, making up ${Math.round((highestDevice.currentConsumption / (summary.currentPower * 1000 || 1)) * 100)}% of your active load.`
      });
    }

    // Insight 2: Room contribution
    const maxRoom = dynamicRoomDistribution.sort((a, b) => b.wattage - a.wattage)[0];
    if (maxRoom) {
      list.push({
        type: 'info',
        title: 'Most Active Sector',
        desc: `The ${maxRoom.name} sector holds the highest active demand, currently drawing ${maxRoom.wattage}W (${maxRoom.value}% of total load).`
      });
    }

    // Insight 3: Time of use tips
    list.push({
      type: 'tip',
      title: 'Off-Peak Scheduling Tip',
      desc: 'Based on peak loads near 6:00 PM, running laundry appliances (Washing Machine) after 9:00 PM will leverage off-peak tariffs, saving up to ₹1500/mo.'
    });

    // Insight 4: Efficiency optimization
    if (summary.efficiencyScore < 85) {
      list.push({
        type: 'warning',
        title: 'Optimize Energy Efficiency',
        desc: 'Your energy efficiency score dropped below 85% due to concurrent high-rated heating appliances. Try staggering water heater runs.'
      });
    } else {
      list.push({
        type: 'tip',
        title: 'Excellent Efficiency Grid',
        desc: 'Good work! Load factor averages are well-balanced today, keeping thermal losses minimal and green energy coefficient high.'
      });
    }

    return list;
  };

  const insights = getInsights();

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">Energy Analytics</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">Deep visual analytics, sector breakdowns, and simulated tariff evaluations.</p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 border-2 border-slate-900 rounded-lg p-1 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <button 
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${timeRange === 'today' ? 'bg-[#1a2a3a] text-white border border-slate-955 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${timeRange === '7days' ? 'bg-[#1a2a3a] text-white border border-slate-955 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${timeRange === '30days' ? 'bg-[#1a2a3a] text-white border border-slate-955 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Analytics KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* KPI 1: Highest Appliance load */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Highest Active Consumer</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight font-serif truncate">
              {highestDevice ? highestDevice.name : 'None'}
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 font-serif">
              {highestDevice && highestDevice.status === 'on' ? highestDevice.currentConsumption : 0} <span className="text-xs font-semibold text-slate-505 text-slate-500 font-sans">W</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block">{highestDevice ? highestDevice.room : '-'}</span>
        </Card>

        {/* KPI 2: Lowest Appliance load */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Lowest Active Consumer</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight font-serif truncate">
              {lowestActiveDevice ? lowestActiveDevice.name : 'None'}
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 font-serif">
              {lowestActiveDevice ? lowestActiveDevice.currentConsumption : 0} <span className="text-xs font-semibold text-slate-505 text-slate-500 font-sans">W</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block">{lowestActiveDevice ? lowestActiveDevice.room : '-'}</span>
        </Card>

        {/* KPI 3: Average daily usage */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Avg. Daily Usage</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight font-serif">System Baseline</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 font-serif">
              23.6 <span className="text-xs font-semibold text-slate-505 text-slate-500 font-sans">kWh</span>
            </p>
          </div>
          <span className="text-[10px] text-[#5a7366] mt-2 flex items-center gap-1 font-bold">
            <TrendingDown size={11} />
            <span>-2.1% efficiency rise</span>
          </span>
        </Card>

        {/* KPI 4: Monthly savings forecast */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Est. Monthly Savings</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight font-serif">Optimization Yield</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 font-serif">
              ₹1524.50
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase mt-2 block">Powered by Smart Tips</span>
        </Card>

        {/* KPI 5: Total Monthly consumption */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">Total Energy Consumed</div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight font-serif">Cumulative Billing</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 font-serif">
              {summary.monthlyUsage} <span className="text-xs font-semibold text-slate-555 text-slate-500 font-sans">kWh</span>
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase mt-2 block">Cycle: Jul 01 - Jul 31</span>
        </Card>

      </div>

      {/* Primary Analytics Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Main Trend Chart (Changes based on Filter state) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {timeRange === 'today' && 'Today\'s Demand Flow'}
              {timeRange === '7days' && 'Last 7 Days Usage Trend'}
              {timeRange === '30days' && 'Monthly Consumption History'}
            </CardTitle>
            <CardDescription>
              {timeRange === 'today' && 'Real-time fluctuations of active household draw (kW)'}
              {timeRange === '7days' && 'Weekly cumulative load patterns matched to solar production (kWh)'}
              {timeRange === '30days' && 'Historical power profiles over the calendar year (kWh)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {timeRange === 'today' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HOURLY_TELEMETRY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="activePower" name="Active Load" stroke="#1a2a3a" strokeWidth={2.5} dot={{ r: 3, stroke: '#0f172a', strokeWidth: 1.5, fill: '#1a2a3a' }} activeDot={{ r: 5 }} unit=" kW" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {timeRange === '7days' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_USAGE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="usage" name="Grid Draw" fill="#1a2a3a" stroke="#0f172a" strokeWidth={1.5} radius={[0, 0, 0, 0]} unit=" kWh" />
                  <Bar dataKey="solar" name="Solar Gen" fill="#c5a059" stroke="#0f172a" strokeWidth={1.5} radius={[0, 0, 0, 0]} unit=" kWh" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {timeRange === '30days' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_USAGE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a2a3a" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1a2a3a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="usage" name="Total Usage" stroke="#1a2a3a" strokeWidth={2.5} fillOpacity={1} fill="url(#areaUsage)" unit=" kWh" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Room Energy Distribution (Donut Pie Chart) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>Power distribution by household sector</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-between">
            <div className="h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner overlay label */}
              <div className="absolute text-center space-y-0.5 pointer-events-none">
                <span className="block text-[8px] uppercase font-bold text-slate-500">Live Grid</span>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  {summary.currentPower} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
                </span>
              </div>
            </div>

            {/* Color labels list */}
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-700 pt-2 border-t-2 border-slate-900">
              {pieData.map((d, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-900" style={{ backgroundColor: d.color }} />
                  <span className="truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Appliance Load Comparisons & Generative Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Device comparative charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appliance Comparison</CardTitle>
            <CardDescription>Active consumption contrasted with rated capacities</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceComparisonData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="consumption" name="Active Load" fill="#1a2a3a" stroke="#0f172a" strokeWidth={1.5} radius={[0, 0, 0, 0]} unit=" W" />
                <Bar dataKey="rated" name="Rated Capacity" fill="#c5a059" stroke="#0f172a" strokeWidth={1.5} radius={[0, 0, 0, 0]} unit=" W" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Generative Insights Engine */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>AI Insights Engine</CardTitle>
            <CardDescription>Platform generated optimizations and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {insights.map((insight, index) => {
              const bg = insight.type === 'warning' 
                ? 'bg-rose-50 border-2 border-rose-900 text-rose-900' 
                : insight.type === 'tip'
                  ? 'bg-emerald-55 bg-emerald-50 border-2 border-emerald-900 text-emerald-900'
                  : 'bg-sky-50 border-2 border-sky-900 text-[#1a2a3a]';
              
              return (
                <div key={index} className={`p-3.5 rounded-xl border-2 flex gap-3 text-xs leading-relaxed ${bg}`}>
                  <div className="shrink-0 mt-0.5">
                    {insight.type === 'warning' ? (
                      <AlertCircle size={15} />
                    ) : (
                      <Lightbulb size={15} />
                    )}
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold font-serif text-slate-900">{insight.title}</h4>
                    <p className="opacity-95 text-[10px]">{insight.desc}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
