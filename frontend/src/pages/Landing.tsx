import { Link } from 'react-router-dom';
import { Zap, BarChart3, Bell, MonitorSmartphone, ArrowRight, Shield, TrendingDown, Activity, ChevronDown } from 'lucide-react';
import poweriqLogo from '../assets/poweriq-logo.png';

const FEATURES = [
  {
    icon: Activity,
    title: 'Live Telemetry',
    desc: 'Real-time power draw across every appliance, updated every 15 minutes via WebSocket stream.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Device Control',
    desc: 'Register, toggle, and configure every smart device in your home from a single control panel.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    desc: 'Weekly profiles, hourly consumption charts, and solar-offset comparisons at your fingertips.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: 'Get notified instantly when a device spikes, a circuit overloads, or your bill is trending high.',
  },
  {
    icon: TrendingDown,
    title: 'Bill Forecasting',
    desc: 'See your projected monthly bill in real time based on current usage patterns and tariff rates.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT-authenticated, per-user data isolation. Your energy data stays yours.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up in seconds. No credit card, no frills — just your email and a password.',
  },
  {
    step: '02',
    title: 'Register Your Devices',
    desc: 'Add your appliances by type — PowerIQ auto-fills rated wattage so setup takes under a minute.',
  },
  {
    step: '03',
    title: 'Monitor & Optimise',
    desc: 'Watch live power data, toggle devices remotely, and use analytics to cut your energy bill.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] font-sans text-slate-900">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b-2 border-slate-900 bg-[#faf9f5]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={poweriqLogo} alt="PowerIQ" className="h-12 w-auto object-contain mix-blend-darken" />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:text-slate-950 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#1a2a3a] border-2 border-slate-900 rounded-lg px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-[#25394e] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 rounded-full px-4 py-1.5 mb-8 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Live Energy Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold font-serif tracking-tight text-slate-900 leading-[1.05] max-w-4xl mx-auto">
          Know exactly where<br />
          <span className="text-[#c5a059]">every watt</span> goes.
        </h1>

        <p className="mt-6 text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
          PowerIQ connects to your smart appliances, streams real-time telemetry, and gives you the analytics to cut your electricity bill — starting today.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white bg-[#1a2a3a] border-2 border-slate-900 rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-[#25394e] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
          >
            Start for Free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="text-sm font-bold uppercase tracking-widest text-slate-700 border-2 border-slate-900 rounded-xl px-6 py-3 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-[#f4f1ea] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
          <span className="text-[9px] uppercase tracking-widest font-bold">Scroll to explore</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y-2 border-slate-900 bg-[#1a2a3a] py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '₹2,400+', label: 'Avg. Annual Savings' },
            { value: '15 min', label: 'Telemetry Interval' },
            { value: '8+', label: 'Device Types Supported' },
            { value: '100%', label: 'Secure & Private' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold font-serif text-[#c5a059]">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-white border-2 border-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
              Everything you need to own your energy.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a2a3a] border-2 border-slate-900 flex items-center justify-center text-[#c5a059] mb-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold font-serif text-slate-900 text-base mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-[#faf9f5] border-y-2 border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-white border-2 border-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
              Up and running in 3 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-left">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-[2px] bg-slate-900 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 3rem)', left: '3.5rem' }} />
                )}
                <div className="relative z-10 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <span className="inline-block font-mono text-3xl font-extrabold text-[#c5a059] mb-3">{step.step}</span>
                  <h3 className="font-bold font-serif text-slate-900 text-base mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a2a3a] border-2 border-slate-900 rounded-3xl p-10 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <Zap size={32} className="text-[#c5a059] mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight mb-3">
              Ready to take control?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Create your free PowerIQ account and start monitoring your home's energy footprint in minutes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1a2a3a] bg-[#c5a059] border-2 border-[#b08c45] rounded-xl px-8 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-[#d4b06a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              Create Free Account <ArrowRight size={16} />
            </Link>
            <p className="mt-4 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-[#c5a059] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-slate-900 bg-[#faf9f5] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={poweriqLogo} alt="PowerIQ" className="h-10 w-auto object-contain mix-blend-darken" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            © 2026 PowerIQ · Smart Energy Analytics
          </p>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-slate-900 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
