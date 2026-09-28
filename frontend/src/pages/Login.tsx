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

  // Post-login animation state
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
    }, 200);

    return () => clearInterval(interval);
  }, [showBootAnim]);

  useEffect(() => {
    if (bootProgress < 30) {
      setBootStatus('AUTHENTICATING TELEMETRY CHANNEL...');
    } else if (bootProgress < 60) {
      setBootStatus('SYNCHRONIZING APPLIANCE MONITORS...');
    } else if (bootProgress < 90) {
      setBootStatus('FETCHING REAL-TIME TARIFF DATA...');
    } else {
      setBootStatus('SESSION VERIFIED. OPENING DASHBOARD...');
    }
  }, [bootProgress]);

  useEffect(() => {
    if (bootProgress >= 100 && showBootAnim) {
      const t1 = setTimeout(() => setBootExiting(true), 400);
      const t2 = setTimeout(() => navigate('/dashboard', { replace: true }), 900);
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
        setShowBootAnim(true);
      } else {
        setErrorMsg('Invalid credentials. (Hint: Use any email and password with 6+ characters).');
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#090d14] px-4 font-sans text-slate-100">
      
      {/* Power-Up Animation Overlay */}
      {showBootAnim && (
        <div 
          className={`absolute inset-0 bg-[#090d14] z-50 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
            bootExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="w-full max-w-sm px-6 text-center space-y-5">
            <img src={poweriqLogo} alt="PowerIQ" className="h-12 w-auto object-contain mx-auto brightness-110" />

            <div className="p-4 bg-[#121824] border border-[#1e293b] rounded-xl space-y-3">
              <div className="w-full bg-[#090d14] h-2 rounded-full overflow-hidden border border-[#1e293b]">
                <div 
                  className="bg-slate-200 h-full transition-all duration-200" 
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>CONNECTING</span>
                <span className="text-slate-200 font-bold">{bootProgress}%</span>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-400">
              {bootStatus}
            </p>
          </div>
        </div>
      )}

      {/* Main Sign-In Form */}
      <div className="w-full max-w-sm z-10 space-y-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <img src={poweriqLogo} alt="PowerIQ" className="h-10 w-auto object-contain mb-2 brightness-110" />
          <p className="text-slate-400 text-xs">
            Smart Energy & Device Telemetry
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-5 shadow-xl">
          <h2 className="text-sm font-semibold text-slate-200">Sign In to PowerIQ</h2>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@domain.com"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded bg-[#0d121d] border-[#1e293b] text-slate-200 focus:ring-0"
                  {...register('rememberMe')}
                />
                <span>Remember session</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link to="/register" className="text-slate-200 hover:underline font-medium">
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
}
