import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Activity, Zap, Cpu, Gauge, Layers, Shield } from 'lucide-react';
import poweriqLogo from '../assets/poweriq-logo.png';

interface ApplianceNode {
  id: string;
  name: string;
  room: string;
  kw: number;
  costPerHour: number;
  status: 'active' | 'standby' | 'idle';
  color: string;
}

const TOPOLOGY_NODES: ApplianceNode[] = [
  { id: 'hvac', name: '1.5T Inverter AC', room: 'Living Room', kw: 2.10, costPerHour: 16.80, status: 'active', color: 'bg-sky-500' },
  { id: 'geyser', name: 'Storage Geyser (25L)', room: 'Master Bath', kw: 2.00, costPerHour: 16.00, status: 'active', color: 'bg-amber-500' },
  { id: 'fridge', name: 'Double Door Refrigerator', room: 'Kitchen', kw: 0.16, costPerHour: 1.28, status: 'active', color: 'bg-emerald-500' },
  { id: 'ev', name: 'Level 2 EV Charger', room: 'Garage', kw: 0.00, costPerHour: 0.00, status: 'standby', color: 'bg-slate-600' },
  { id: 'pc', name: 'Dual-Monitor PC', room: 'Study', kw: 0.38, costPerHour: 3.04, status: 'active', color: 'bg-indigo-500' },
];

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'topology' | 'distribution' | 'metrics'>('topology');
  const [selectedNode, setSelectedNode] = useState<ApplianceNode>(TOPOLOGY_NODES[0]);
  const [tariffRate, setTariffRate] = useState<number>(8.0);
  const [calcHours, setCalcHours] = useState<number>(8);
  const [calcWatts, setCalcWatts] = useState<number>(2100);

  const totalKw = TOPOLOGY_NODES.reduce((sum, n) => n.status === 'active' ? sum + n.kw : sum, 0);
  const activeCount = TOPOLOGY_NODES.filter(n => n.status === 'active').length;
  const hourlyCost = totalKw * tariffRate;
  const monthlyCostEst = Math.round(totalKw * 8 * 30 * tariffRate);

  const calcDailyKwh = (calcWatts * calcHours) / 1000;
  const calcMonthlyCost = Math.round(calcDailyKwh * 30 * tariffRate);

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 font-sans selection:bg-slate-700 selection:text-white">
      
      {/* ── TOP NAVIGATION ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0d121d]/90 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={poweriqLogo} alt="PowerIQ" className="h-8 w-auto object-contain brightness-110" />
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-xs font-medium text-slate-300 hover:text-slate-100 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="text-xs font-medium text-slate-100 bg-[#1e293b] hover:bg-[#28364f] border border-[#334155] rounded-lg px-3.5 py-1.5 transition-all"
            >
              Register Account
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100 leading-[1.15]">
              Know exactly which appliance is inflating your electricity bill.
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-normal">
              PowerIQ monitors telemetry per device — calculating true hourly power draw and monthly rupee costs across every room. No estimated averages. Pure appliance transparency.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-950 bg-slate-100 hover:bg-white rounded-lg px-5 py-2.5 transition-all shadow-sm"
              >
                Start Monitoring Your Home <ArrowRight size={14} />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-[#121824] hover:bg-[#182030] border border-[#1e293b] rounded-lg px-4 py-2.5 transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1e293b] text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Sampling</span>
                <span className="text-slate-200 font-medium">15-min Telemetry</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tariff Model</span>
                <span className="text-slate-200 font-medium">₹/kWh Tiered</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Isolation</span>
                <span className="text-slate-200 font-medium">Per-User DB Scope</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Modern Live Energy Topology Monitor */}
          <div className="lg:col-span-6">
            <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-5 shadow-2xl space-y-4">
              
              {/* Card Header + View Switcher */}
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">Live Power Topology</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">{activeCount} Online</span>
                </div>

                <div className="flex gap-1 bg-[#0d121d] p-1 rounded-lg border border-[#1e293b]">
                  <button
                    onClick={() => setActiveTab('topology')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === 'topology' ? 'bg-[#1e293b] text-slate-100' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers size={12} /> Topology
                  </button>
                  <button
                    onClick={() => setActiveTab('distribution')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === 'distribution' ? 'bg-[#1e293b] text-slate-100' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity size={12} /> Share
                  </button>
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === 'metrics' ? 'bg-[#1e293b] text-slate-100' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Gauge size={12} /> Metrics
                  </button>
                </div>
              </div>

              {/* KPI Summary Banner */}
              <div className="grid grid-cols-3 gap-3 bg-[#0d121d] border border-[#1e293b] rounded-lg p-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Total Load</p>
                  <p className="text-xl font-bold font-mono text-slate-100 mt-0.5">{totalKw.toFixed(2)} <span className="text-xs font-sans font-normal text-slate-400">kW</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Hourly Cost</p>
                  <p className="text-xl font-bold font-mono text-slate-100 mt-0.5">₹{hourlyCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Est. Monthly</p>
                  <p className="text-xl font-bold font-mono text-slate-100 mt-0.5">₹{monthlyCostEst.toLocaleString()}</p>
                </div>
              </div>

              {/* TAB 1: TOPOLOGY MAP */}
              {activeTab === 'topology' && (
                <div className="space-y-3">
                  <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-4 relative overflow-hidden">
                    
                    {/* SVG Flow Lines Background */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                      <line x1="15%" y1="20%" x2="85%" y2="20%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50%" y1="20%" x2="50%" y2="85%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
                    </svg>

                    {/* Central Gateway Node */}
                    <div className="flex items-center justify-between bg-[#121824] border border-[#2a3650] rounded-lg p-3 mb-4 shadow-md relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800 flex items-center justify-center text-sky-400">
                          <Zap size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-100">Main Service Grid Feed</p>
                          <p className="text-[10px] text-slate-400 font-mono">231.4V AC · 50.0 Hz · Tariff ₹{tariffRate}/kWh</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-0.5 rounded">
                        Active Stream
                      </span>
                    </div>

                    {/* Appliance Branch Nodes List */}
                    <div className="space-y-2 relative z-10">
                      <p className="text-[11px] text-slate-400 font-medium">Discovered Appliance Nodes (Click to Inspect):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TOPOLOGY_NODES.map(node => (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                              selectedNode.id === node.id 
                                ? 'bg-[#1a2538] border-[#38bdf8] shadow-sm' 
                                : 'bg-[#121824] border-[#1e293b] hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                              <div>
                                <p className="text-xs font-medium text-slate-200">{node.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{node.room}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-mono font-bold text-slate-100">{node.kw.toFixed(2)}kW</p>
                              <p className="text-[10px] text-slate-400 font-mono">₹{node.costPerHour.toFixed(1)}/h</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Selected Node Details Bar */}
                  <div className="bg-[#0d121d] border border-[#1e293b] rounded-lg p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Inspecting Node: </span>
                      <span className="font-semibold text-slate-100">{selectedNode.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 font-mono">
                      <span>{selectedNode.kw} kW</span>
                      <span>₹{selectedNode.costPerHour.toFixed(2)}/hr</span>
                      <span className="text-emerald-400 font-sans font-medium text-[11px]">Normal Load</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DISTRIBUTION BARS */}
              {activeTab === 'distribution' && (
                <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-4 space-y-3">
                  <p className="text-xs font-medium text-slate-300 mb-2">Live Appliance Load Percentage Share:</p>
                  {TOPOLOGY_NODES.map(node => {
                    const pct = totalKw > 0 ? Math.round((node.kw / totalKw) * 100) : 0;
                    return (
                      <div key={node.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-300">
                          <span>{node.name} ({node.room})</span>
                          <span className="font-mono">{node.kw} kW ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-[#121824] rounded-full overflow-hidden border border-[#1e293b]">
                          <div 
                            className={`h-full ${node.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: METRICS */}
              {activeTab === 'metrics' && (
                <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#121824] border border-[#1e293b] rounded-lg p-3">
                    <span className="text-slate-400 block text-[11px]">Power Factor</span>
                    <span className="text-lg font-bold font-mono text-slate-100 mt-1 block">0.98 PF</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">High Grid Efficiency</span>
                  </div>
                  <div className="bg-[#121824] border border-[#1e293b] rounded-lg p-3">
                    <span className="text-slate-400 block text-[11px]">RMS Voltage</span>
                    <span className="text-lg font-bold font-mono text-slate-100 mt-1 block">231.4 V</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Stable Supply</span>
                  </div>
                  <div className="bg-[#121824] border border-[#1e293b] rounded-lg p-3">
                    <span className="text-slate-400 block text-[11px]">Current Draw</span>
                    <span className="text-lg font-bold font-mono text-slate-100 mt-1 block">20.9 A</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Aggregate Current</span>
                  </div>
                  <div className="bg-[#121824] border border-[#1e293b] rounded-lg p-3">
                    <span className="text-slate-400 block text-[11px]">Telemetry Frequency</span>
                    <span className="text-lg font-bold font-mono text-slate-100 mt-1 block">15 min</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Live Stream Interval</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ── APPLIANCE COST CALCULATOR ────────────────────────────── */}
      <section className="border-y border-[#1e293b] bg-[#0d121d] py-14 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Interactive Utility Calculator</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mt-1">
                Calculate what an appliance costs on your tariff
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Adjust wattage and daily run hours to inspect how much a single appliance adds to your monthly electric bill.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#121824] border border-[#1e293b] rounded-xl p-6">
            
            {/* Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Rated Wattage */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Appliance Rated Power</span>
                  <span className="font-mono text-slate-100 font-bold">{calcWatts} Watts ({(calcWatts/1000).toFixed(2)} kW)</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="8000" 
                  step="50"
                  value={calcWatts}
                  onChange={(e) => setCalcWatts(Number(e.target.value))}
                  className="w-full accent-slate-300 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50W (LED)</span>
                  <span>1500W (Geyser)</span>
                  <span>2400W (Oven)</span>
                  <span>7200W (EV)</span>
                </div>
              </div>

              {/* Hours Per Day */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Daily Usage Duration</span>
                  <span className="font-mono text-slate-100 font-bold">{calcHours} Hours / Day</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  step="1"
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  className="w-full accent-slate-300 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Tariff Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Electricity Tariff Rate</span>
                  <span className="font-mono text-slate-100 font-bold">₹{tariffRate.toFixed(2)} / kWh</span>
                </div>
                <div className="flex gap-2">
                  {[6.5, 8.0, 9.5, 12.0].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setTariffRate(rate)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                        tariffRate === rate 
                          ? 'bg-[#1e293b] text-slate-100 border-slate-500 font-bold' 
                          : 'bg-[#090d14] text-slate-400 border-[#1e293b] hover:text-slate-200'
                      }`}
                    >
                      ₹{rate.toFixed(1)}/kWh
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Result Panel */}
            <div className="lg:col-span-5 bg-[#090d14] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Calculated Impact</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-xs text-slate-400">Daily Consumption</span>
                    <p className="text-lg font-bold font-mono text-slate-200">{calcDailyKwh.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">kWh / day</span></p>
                  </div>
                  <div className="pt-2 border-t border-[#182030]">
                    <span className="text-xs text-slate-400">Estimated Monthly Expenditure</span>
                    <p className="text-3xl font-bold font-mono text-slate-100 mt-0.5">₹{calcMonthlyCost.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Based on 30 billing days at ₹{tariffRate}/kWh</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#182030] text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-slate-400 shrink-0" />
                <span>PowerIQ tracks this exact metric live per device from your smart meter data.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── ARCHITECTURE FEATURES ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Platform Capabilities</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mt-1">
            Engineered for precision energy management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a2336] border border-[#2a3650] flex items-center justify-center text-slate-200">
              <Activity size={18} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Live Telemetry Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Streams wattage, voltage, and current draw at 15-minute intervals directly to your dashboard without manual reads or daily rollups.
            </p>
          </div>

          <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a2336] border border-[#2a3650] flex items-center justify-center text-slate-200">
              <Cpu size={18} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Built-in Device Library</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-loaded with 16 device categories (ACs, geysers, EV chargers, refrigerators) and rated wattage benchmarks to streamline setup.
            </p>
          </div>

          <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a2336] border border-[#2a3650] flex items-center justify-center text-slate-200">
              <Shield size={18} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Isolated Data Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each user account operates with isolated database scopes and JWT auth security, ensuring telemetry privacy across homes.
            </p>
          </div>

        </div>
      </section>

      {/* ── DEVICE TYPE PRESETS ─────────────────────────────────── */}
      <section className="border-t border-[#1e293b] bg-[#0d121d] py-14 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Device Profiles</span>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">Pre-configured appliance wattages</h2>
            </div>
            <Link to="/register" className="text-xs font-medium text-slate-400 hover:text-slate-100 flex items-center gap-1">
              View full list <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'HVAC', watts: '2100W' },
              { label: 'Refrigeration', watts: '160W' },
              { label: 'Water Heater', watts: '2000W' },
              { label: 'Washing', watts: '2200W' },
              { label: 'Oven', watts: '2400W' },
              { label: 'Television', watts: '150W' },
              { label: 'EV Charger', watts: '7200W' },
              { label: 'Workstation', watts: '380W' },
            ].map(item => (
              <div key={item.label} className="bg-[#121824] border border-[#1e293b] rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-slate-200 truncate">{item.label}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">{item.watts}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Ready to set up your home?</h2>
            <p className="text-xs text-slate-400 max-w-md">
              Create an account to configure your rooms, add your appliances, and view live telemetry breakdown.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/register" 
              className="text-xs font-medium text-slate-950 bg-slate-100 hover:bg-white rounded-lg px-5 py-2.5 transition-all"
            >
              Register Now
            </Link>
            <Link 
              to="/login" 
              className="text-xs font-medium text-slate-300 bg-[#090d14] hover:bg-[#0f1522] border border-[#1e293b] rounded-lg px-4 py-2.5 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#1e293b] bg-[#0d121d] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img src={poweriqLogo} alt="PowerIQ" className="h-7 w-auto object-contain brightness-110" />
            <span>Telemetry & Smart Energy Intelligence</span>
          </div>
          <div className="flex gap-4 text-slate-400">
            <Link to="/login" className="hover:text-slate-200">Sign In</Link>
            <Link to="/register" className="hover:text-slate-200">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
