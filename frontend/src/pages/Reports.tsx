import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  FileText, 
  Download, 
  Printer, 
  FileSpreadsheet,
  Zap,
  Activity,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('monthly');

  // Mock data for the current report view
  const reportData = {
    totalEnergy: 980, // kWh
    avgDaily: 31.6, // kWh
    highestDevice: 'HVAC System',
    lowestDevice: 'Smart Bulb',
    estimatedBill: 7840, // INR
    efficiencyScore: 88, // out of 100
    peakHours: '6:00 PM - 9:00 PM',
  };

  const chartData = [
    { name: 'Mon', usage: 28 },
    { name: 'Tue', usage: 30 },
    { name: 'Wed', usage: 25 },
    { name: 'Thu', usage: 32 },
    { name: 'Fri', usage: 29 },
    { name: 'Sat', usage: 42 },
    { name: 'Sun', usage: 38 },
  ];

  const deviceWise = [
    { name: 'HVAC System', room: 'Living Room', usage: '410 kWh', cost: '₹3280', percent: 41 },
    { name: 'Water Heater', room: 'Basement', usage: '210 kWh', cost: '₹1680', percent: 21 },
    { name: 'Refrigerator', room: 'Kitchen', usage: '120 kWh', cost: '₹960', percent: 12 },
    { name: 'Washing Machine', room: 'Utility', usage: '90 kWh', cost: '₹720', percent: 9 },
    { name: 'Others', room: 'Various', usage: '150 kWh', cost: '₹1200', percent: 17 },
  ];

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-100 border-emerald-900';
    if (score >= 70) return 'text-amber-700 bg-amber-100 border-amber-900';
    return 'text-rose-700 bg-rose-100 border-rose-900';
  };

  return (
    <div className="space-y-6 font-sans text-left pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">Energy Reports</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">Generate, preview, and export comprehensive consumption analytics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
            <Printer size={15} />
            <span className="hidden sm:inline">Print Report</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
            <FileSpreadsheet size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs">
            <Download size={15} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-[#eae6d9] rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] max-w-fit">
        {(['daily', 'weekly', 'monthly', 'yearly'] as ReportType[]).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              reportType === type
                ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { title: 'Total Energy', value: `${reportData.totalEnergy} kWh`, icon: Zap, sub: 'Accrued usage' },
          { title: 'Avg Daily', value: `${reportData.avgDaily} kWh`, icon: Activity, sub: 'Stable trend' },
          { title: 'Highest Consumer', value: reportData.highestDevice, icon: ArrowUpRight, sub: 'Requires focus' },
          { title: 'Lowest Consumer', value: reportData.lowestDevice, icon: ArrowDownRight, sub: 'Optimized' },
          { title: 'Estimated Bill', value: `₹${reportData.estimatedBill}`, icon: FileText, sub: 'At ₹8.00/kWh' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 flex flex-col justify-between h-full bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block leading-tight">{stat.title}</span>
              <stat.icon size={14} className="text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold font-serif text-slate-900 leading-none">{stat.value}</p>
              <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">{stat.sub}</span>
            </div>
          </Card>
        ))}

        {/* Efficiency Score Card */}
        <Card className={`p-4 flex flex-col justify-between h-full border-2 ${getEfficiencyColor(reportData.efficiencyScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] uppercase tracking-wider font-bold block leading-tight">Efficiency Score</span>
            <CheckCircle size={14} />
          </div>
          <div>
            <p className="text-2xl font-bold font-serif leading-none">{reportData.efficiencyScore}/100</p>
            <span className="text-[9px] font-bold block mt-1 uppercase tracking-wider">Excellent Grade</span>
          </div>
        </Card>
      </div>

      {/* Report Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Device Table & Cost */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b-2 border-slate-900">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={18} />
                Device-wise Consumption
              </CardTitle>
              <CardDescription>Breakdown of energy usage by individual appliances.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-500 uppercase font-bold tracking-wider bg-[#faf9f5] border-b-2 border-slate-900">
                    <tr>
                      <th className="px-6 py-3">Device / Room</th>
                      <th className="px-6 py-3 text-right">Usage</th>
                      <th className="px-6 py-3 text-right">Cost (₹)</th>
                      <th className="px-6 py-3 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {deviceWise.map((dev, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-semibold text-slate-900">
                          {dev.name}
                          <span className="block text-[10px] font-medium text-slate-500 mt-0.5">{dev.room}</span>
                        </td>
                        <td className="px-6 py-3 text-right font-serif font-bold text-slate-700">{dev.usage}</td>
                        <td className="px-6 py-3 text-right font-serif font-bold text-slate-900">{dev.cost}</td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 border border-slate-300">
                            {dev.percent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border-2 border-slate-900 p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-lg">
                              <p className="text-[10px] font-bold uppercase text-slate-500">{payload[0].payload.name}</p>
                              <p className="font-serif font-bold text-sm text-slate-900">{payload[0].value} kWh</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.usage > 35 ? '#0f172a' : '#94a3b8'} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Cost Breakdown & Suggestions */}
        <div className="space-y-6">
          <Card className="bg-[#1a2a3a] text-white border-slate-950">
            <CardHeader>
              <CardTitle className="text-white">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Energy Charges</span>
                <span className="font-serif font-bold">₹7,840.00</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Fixed Network Fee</span>
                <span className="font-serif font-bold">₹150.00</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Taxes (5%)</span>
                <span className="font-serif font-bold">₹399.50</span>
              </div>
              <div className="flex justify-between items-center text-lg pt-2 text-yellow-400">
                <span className="font-bold">Total Estimated</span>
                <span className="font-serif font-bold">₹8,389.50</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={16} />
                Peak Usage Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl border-2 border-orange-900 bg-orange-50 text-orange-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">Concentrated Load</span>
                  <p className="font-serif font-bold text-xl">{reportData.peakHours}</p>
                </div>
                <AlertTriangle size={24} className="opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={16} />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-xs leading-relaxed">
                <strong className="block text-slate-900 mb-1">Shift HVAC Usage</strong>
                Cooling spaces before 4 PM can reduce load during peak tariff hours, saving ~5% overall.
              </div>
              <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-xs leading-relaxed">
                <strong className="block text-slate-900 mb-1">Phantom Loads</strong>
                Your entertainment center is drawing 45W while on standby. Consider a smart power strip.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
