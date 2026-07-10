import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import poweriqLogo from '../assets/poweriq-logo.png';

export default function BootSequence() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING GRID SUBSYSTEMS...');
  const [logLines, setLogLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exiting'>('loading');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Status text updates
  useEffect(() => {
    if (progress < 15) {
      setStatusText('INITIALIZING GRID SUBSYSTEMS...');
    } else if (progress < 30) {
      setStatusText('CONNECTING TO LOCAL SUBSTATION [0x4A]...');
    } else if (progress < 45) {
      setStatusText('SYNCHRONIZING DIGITAL ENERGY CORES...');
    } else if (progress < 60) {
      setStatusText('CALIBRATING VOLTAGE REGULATORS (240V)...');
    } else if (progress < 75) {
      setStatusText('MAPPING DEVICE TELEMETRY ENDPOINTS...');
    } else if (progress < 90) {
      setStatusText('SECURE TELEMETRY LINK ESTABLISHED...');
    } else {
      setStatusText('GRID IS ACTIVE. LAUNCHING DASHBOARD...');
    }
  }, [progress]);

  // Terminal log lines that accumulate
  useEffect(() => {
    const entries = [
      { at: 10, text: `[AUTH] User ${user?.name || 'OPERATOR'} authenticated successfully` },
      { at: 20, text: '[NET] Establishing encrypted tunnel to grid controller...' },
      { at: 30, text: '[NET] TLS 1.3 handshake complete — cipher: AES-256-GCM' },
      { at: 40, text: '[GRID] Substation 0x4A online — 14 devices detected' },
      { at: 50, text: '[SYNC] Pulling last 24h telemetry cache (2.4 MB)...' },
      { at: 60, text: '[VOLT] Phase A: 239.8V | Phase B: 240.1V | Phase C: 240.0V' },
      { at: 70, text: '[TELEM] Real-time stream active — 500ms polling interval' },
      { at: 80, text: '[ALERT] 3 unread alerts queued for review' },
      { at: 90, text: '[SYS] All subsystems nominal — dashboard ready' },
      { at: 100, text: '[BOOT] Sequence complete. Transferring control...' },
    ];

    entries.forEach((entry) => {
      if (progress >= entry.at) {
        setLogLines((prev) => {
          if (!prev.includes(entry.text)) return [...prev, entry.text];
          return prev;
        });
      }
    });
  }, [progress, user]);

  // Navigate to dashboard once progress completes
  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      const t1 = setTimeout(() => setPhase('complete'), 600);
      const t2 = setTimeout(() => setPhase('exiting'), 1200);
      const t3 = setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [progress, phase, navigate]);

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center bg-[#f4f1ea] overflow-hidden font-sans text-slate-900 transition-opacity duration-600 ${
        phase === 'exiting' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Grid dot background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Subtle horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-[#c5a059]/20 pointer-events-none z-10"
        style={{
          top: `${(progress % 100)}%`,
          transition: 'top 0.3s linear',
        }}
      />

      <div className="w-full max-w-lg px-6 z-20">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Centered Logo */}
          <div className="flex justify-center mb-6">
            <img src={poweriqLogo} alt="PowerIQ" className="h-24 w-auto object-contain mix-blend-darken" />
          </div>

          <span className="block text-[8px] uppercase tracking-[0.25em] text-slate-500 font-bold">
            Substation Auth Gateway
          </span>
          <h1 className="text-4xl font-extrabold font-serif text-slate-900 tracking-wide mt-1">
            Power<span className="text-[#c5a059]">IQ</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
            Welcome back, {user?.name || 'Operator'}
          </p>
        </div>

        {/* Battery meter card */}
        <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-6 mb-4">
          {/* Segmented bar */}
          <div className="flex gap-1.5 justify-center mb-4">
            {[...Array(10)].map((_, idx) => {
              const isActive = progress >= (idx + 1) * 10;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-8 border-2 border-slate-900 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1a2a3a] shadow-[1px_1px_0px_0px_#c5a059]'
                      : 'bg-slate-50'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] font-bold text-slate-900 uppercase tracking-widest px-1">
            <span>Grid Load</span>
            <span className="text-[#c5a059]">{progress}%</span>
          </div>
        </div>

        {/* Terminal log card */}
        <div className="bg-[#1a2a3a] border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-4 mb-4">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-600" />
            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest ml-2">
              poweriq-boot.log
            </span>
          </div>

          <div className="h-36 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-0.5 scrollbar-thin">
            {logLines.map((line, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  i === logLines.length - 1
                    ? 'text-[#c5a059]'
                    : 'text-slate-400'
                }`}
              >
                <span className="text-slate-600 mr-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {line}
              </div>
            ))}
            {/* Blinking cursor */}
            {progress < 100 && (
              <span className="inline-block w-2 h-3 bg-[#c5a059] animate-pulse ml-5" />
            )}
          </div>
        </div>

        {/* Status line */}
        <p className="text-center text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest h-4">
          {statusText}
        </p>
      </div>
    </div>
  );
}
