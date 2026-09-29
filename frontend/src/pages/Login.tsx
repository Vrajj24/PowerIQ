import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
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
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMsg('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Invalid email or password. Please check your credentials and try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#090d14] px-4 font-sans text-slate-100">
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

          {/* Prominent Red Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-300">Authentication Error</p>
                <p className="text-rose-200/90 text-[11px] leading-relaxed">{errorMsg}</p>
              </div>
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
