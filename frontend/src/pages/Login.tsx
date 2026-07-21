import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import poweriqLogo from '../assets/poweriq-logo.png';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post-login power-up animation state
  const [showBootAnim, setShowBootAnim] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState('CONNECTING SYSTEM...');
  const [bootExiting, setBootExiting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Boot progress ticker — only runs when showBootAnim is true
  useEffect(() => {
    if (!showBootAnim) return;

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 8;
        return Math.min(prev + increment, 100);
      });
    }, 250);

    return () => clearInterval(interval);
  }, [showBootAnim]);

  // Update status text based on progress
  useEffect(() => {
    if (bootProgress < 25) {
      setBootStatus('CONNECTING TO LOCAL SUBSTATION [0x4A]...');
    } else if (bootProgress < 50) {
      setBootStatus('SYNCHRONIZING DIGITAL ENERGY CORES...');
    } else if (bootProgress < 75) {
      setBootStatus('CALIBRATING VOLTAGE REGULATORS (240V)...');
    } else if (bootProgress < 100) {
      setBootStatus('SECURE TELEMETRY LINK ESTABLISHED...');
    } else {
      setBootStatus('GRID IS ACTIVE. SECURE ACCESS DEPLOYED.');
    }
  }, [bootProgress]);

  // Navigate to dashboard once boot animation finishes
  useEffect(() => {
    if (bootProgress >= 100 && showBootAnim) {
      const t1 = setTimeout(() => setBootExiting(true), 600);
      const t2 = setTimeout(() => navigate('/dashboard', { replace: true }), 1300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [bootProgress, showBootAnim, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        // Trigger the boot animation instead of navigating immediately
        setShowBootAnim(true);
      } else {
        setErrorMsg('Invalid email or password. Hint: Use any email and a password of at least 6 characters.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f4f1ea] overflow-hidden px-4 font-sans text-slate-900">
      
      {/* Simple dot grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      </div>

      {/* ═══════ Post-Login Power-Up Animation Overlay ═══════ */}
      {showBootAnim && (
        <div 
          className={`absolute inset-0 bg-[#f4f1ea] z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            bootExiting ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="w-full max-w-sm px-6 text-center space-y-6">
            <div>
              <img src={poweriqLogo} alt="PowerIQ" className="h-20 w-auto object-contain mx-auto mix-blend-darken" />
            </div>

            {/* Retro segmented battery meter */}
            <div className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex gap-1.5 justify-center">
                {[...Array(5)].map((_, idx) => {
                  const isActive = bootProgress >= (idx + 1) * 20;
                  return (
                    <div 
                      key={idx}
                      className={`w-7 h-10 border-2 border-slate-900 transition-all duration-200 ${
                        isActive ? 'bg-[#1a2a3a] shadow-[1.5px_1.5px_0px_0px_#c5a059]' : 'bg-slate-100'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-[10px] font-bold text-slate-900 uppercase tracking-widest px-2">
                <span>GRID LOAD</span>
                <span className="text-[#c5a059]">{bootProgress}%</span>
              </div>
            </div>

            <p className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-widest leading-none h-4">
              {bootStatus}
            </p>
          </div>
        </div>
      )}

      {/* ═══════ Main Sign-In Form ═══════ */}
      <div className="w-full max-w-md z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img src={poweriqLogo} alt="PowerIQ" className="h-24 w-auto object-contain mb-1 mix-blend-darken" />
          <p className="text-slate-600 text-xs font-semibold mt-1.5 max-w-xs leading-relaxed uppercase tracking-wider">
            Enterprise Smart Energy Analytics
          </p>
        </div>

        {/* Login Panel */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 text-left">Sign In</h2>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border-2 border-rose-900 text-rose-900 text-xs flex items-start gap-2.5 font-bold uppercase tracking-wide">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="e.g. john@poweriq.com"
              leftIcon={<Mail size={15} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider pt-1">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white border border-slate-200 text-[#c5a059] focus:ring-[#c5a059]/20 accent-[#c5a059]"
                  {...register('rememberMe')}
                />
                <span>Remember me</span>
              </label>
              
              <a href="#forgot" className="text-[#c5a059] hover:text-[#b08c45] hover:underline font-bold transition-colors">
                Forgot?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              isLoading={isSubmitting}
            >
              Access Dashboard
            </Button>
          </form>
        </div>

        {/* Footer actions */}
        <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#c5a059] hover:underline hover:text-[#b08c45] transition-colors">
            Request credentials
          </Link>
        </p>

      </div>
    </div>
  );
}
