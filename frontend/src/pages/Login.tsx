import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import AuthLayout from '../layouts/AuthLayout';

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
  const [recoveryOpen, setRecoveryOpen] = useState(false);

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
    <AuthLayout mode="login">
      <div className="w-full space-y-6">



        {/* Sign-in form */}
        <div className="auth-form-panel space-y-5">
          <h2 className="auth-form-title">Welcome back.</h2>

          {/* Prominent Red Error Alert */}
          {errorMsg && (
            <div role="alert" className="p-3.5 rounded-sm bg-rose-100/60 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-700">Authentication Error</p>
                <p className="text-rose-700/90 text-[11px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@domain.com"
              leftIcon={<Mail size={15} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="auth-form-options">
              <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded bg-paper border-line text-ink focus:ring-0"
                  {...register('rememberMe')}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="auth-recovery-button" aria-expanded={recoveryOpen} aria-controls="password-recovery-help" onClick={() => setRecoveryOpen(!recoveryOpen)}>Forgot password?</button>
            </div>
            {recoveryOpen && <p id="password-recovery-help" className="auth-recovery-note" role="status">Password recovery is not available in PowerIQ yet. You will need your existing password to sign in.</p>}

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

        <p className="auth-switch">
          New to PowerIQ?{' '}
          <Link to="/register" className="text-ink hover:underline font-medium">
            Create an account
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}
