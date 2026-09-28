import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Cpu, Activity, Sliders, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import poweriqLogo from '../assets/poweriq-logo.png';

interface InteractiveDevice {
  id: string;
  name: string;
  room: string;
  watts: number;
  active: boolean;
  category: string;
}

const INITIAL_SIMULATOR_DEVICES: InteractiveDevice[] = [
  { id: 'ac', name: '1.5T Inverter AC', room: 'Living Room', watts: 2100, active: true, category: 'HVAC' },
  { id: 'geyser', name: 'Storage Geyser (25L)', room: 'Master Bath', watts: 2000, active: false, category: 'Water Heater' },
  { id: 'fridge', name: 'Double Door Fridge', room: 'Kitchen', watts: 160, active: true, category: 'Refrigeration' },
  { id: 'wm', name: 'Front Load Washer', room: 'Laundry', watts: 2200, active: true, category: 'Laundry' },
  { id: 'ev', name: 'Level 2 EV Charger', room: 'Garage', watts: 7200, active: false, category: 'EV Charging' },
  { id: 'workstation', name: 'Dual-Monitor PC', room: 'Study', watts: 380, active: true, category: 'Computing' },
];

export default function Landing() {
  const [devices, setDevices] = useState<InteractiveDevice[]>(INITIAL_SIMULATOR_DEVICES);
  const [tariffRate, setTariffRate] = useState<number>(8.0); // ₹8/kWh
  const [calcHours, setCalcHours] = useState<number>(6);
  const [calcWatts, setCalcWatts] = useState<number>(2000);

  // Telemetry Packet Log Simulation
  const [logs, setLogs] = useState<string[]>([
    '11:45:01 · TELEMETRY_PKT · device_id=split_ac_01 · draw=2.10kW · v=231V · status=OK',
    '11:45:00 · TELEMETRY_PKT · device_id=fridge_01 · draw=0.16kW · v=229V · status=OK',
    '11:44:58 · TARIFF_ENGINE · current_rate=₹8.00/kWh · aggregate_load=4.84kW',
  ]);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
    const dev = devices.find(d => d.id === id);
    if (dev) {
      const now = new Date().toLocaleTimeString();
      const statusText = !dev.active ? 'POWER_ON' : 'POWER_OFF';
      const drawText = !dev.active ? `${(dev.watts / 1000).toFixed(2)}kW` : '0.00kW';
      setLogs(prev => [
        `${now} · EVENT_${statusText} · device=${dev.id} · new_draw=${drawText}`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  const activeDevicesCount = devices.filter(d => d.active).length;
  const totalWatts = devices.reduce((sum, d) => d.active ? sum + d.watts : sum, 0);
  const totalKw = (totalWatts / 1000).toFixed(2);
  const estimatedDailyKwh = (totalWatts * 8) / 1000; // assuming avg 8h run
  const estimatedMonthlyBill = Math.round(estimatedDailyKwh * 30 * tariffRate);

  // Calculator outputs
  const calcDailyKwh = (calcWatts * calcHours) / 1000;
  const calcMonthlyCost = Math.round(calcDailyKwh * 30 * tariffRate);

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 font-sans selection:bg-slate-700 selection:text-white">
      
      {/* ── TOP NAVIGATION ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0d121d]/90 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={poweriqLogo} alt="PowerIQ" className="h-8 w-auto object-contain brightness-110" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#141b29] border border-[#222d42] rounded-full px-2.5 py-0.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-pulse-subtle" />
              v2.4 Telemetry Engine
            </span>
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

      {/* ── HERO SECTION: Live Interactive Console ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121824] border border-[#1e293b] text-xs text-slate-400 font-mono">
              <Zap size={13} className="text-slate-300" />
              <span>Device-level power telemetry & tariff intelligence</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
              Know exactly which appliance is inflating your electricity bill.
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              PowerIQ monitors telemetry per device — calculating true hourly power draw and monthly rupee costs across every room. No estimated averages. Pure appliance transparency.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-950 bg-slate-100 hover:bg-white rounded-lg px-5 py-2.5 transition-all"
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
                <span className="font-mono text-slate-200 font-medium">15-min Telemetry</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tariff Model</span>
                <span className="font-mono text-slate-200 font-medium">₹/kWh Tiered</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Isolation</span>
                <span className="font-mono text-slate-200 font-medium">Per-User DB</span>
              </div>
            </div>
          </div>

          {/* Hero Interactive Console Right */}
          <div className="lg:col-span-6">
            <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-5 shadow-2xl space-y-4">
              
              {/* Header of Interactive Console */}
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 anim-pulse-subtle" />
                  <span className="text-xs font-semibold text-slate-200">Interactive Telemetry Console</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Click toggles to test live load</span>
              </div>

              {/* Console KPI Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-[#0d121d] border border-[#1e293b] rounded-lg p-3 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active Load</p>
                  <p className="text-xl font-bold font-mono text-slate-100">{totalKw} <span className="text-xs text-slate-400 font-sans">kW</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Monthly</p>
                  <p className="text-xl font-bold font-mono text-slate-100">₹{estimatedMonthlyBill.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active Devices</p>
                  <p className="text-xl font-bold font-mono text-slate-100">{activeDevicesCount} / {devices.length}</p>
                </div>
              </div>

              {/* Interactive Device Switches Grid */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-400">Simulated Home Devices (Click to Toggle):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {devices.map(d => (
                    <button
                      key={d.id}
                      onClick={() => toggleDevice(d.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                        d.active 
                          ? 'bg-[#182236] border-[#2b3a5a] text-slate-100' 
                          : 'bg-[#090d14] border-[#182030] text-slate-500 hover:border-[#222d42]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium leading-tight">{d.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{d.room} · {(d.watts/1000).toFixed(2)}kW</p>
                      </div>
                      <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${d.active ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${d.active ? 'translate-x-3' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Telemetry Log Output */}
              <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-3 font-mono text-[10px] space-y-1 text-slate-400 max-h-24 overflow-hidden">
                <p className="text-slate-500 border-b border-[#182030] pb-1 text-[9px] uppercase tracking-wider">Telemetry Packet Stream Log:</p>
                {logs.map((log, i) => (
                  <p key={i} className="truncate text-slate-300">{log}</p>
                ))}
              </div>

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
                    <p className="text-lg font-bold font-mono text-slate-200">{calcDailyKwh.toFixed(2)} <span className="text-xs font-normal text-slate-400">kWh / day</span></p>
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
              <Sliders size={18} />
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
