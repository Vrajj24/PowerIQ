import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: authRegister, isAuthenticated } = useAuth();
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const success = await authRegister(data.name, data.email, data.password);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMsg('Registration failed. Please verify your details.');
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred during registration.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <div className="w-full space-y-6">



        {/* Register Panel */}
        <div className="auth-form-panel space-y-5">
          <h2 className="auth-form-title">Make yourself power<br />aware.</h2>

          {errorMsg && (
            <div role="alert" className="p-3.5 rounded-sm bg-rose-100/60 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-700">Registration Error</p>
                <p className="text-rose-700/90 text-[11px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="e.g. John Doe"
              leftIcon={<User size={15} />}
              error={errors.name?.message}
              {...register('name')}
            />

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
              autoComplete="new-password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="text-ink hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}
