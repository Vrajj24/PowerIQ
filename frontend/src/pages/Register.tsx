import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import poweriqLogo from '../assets/poweriq-logo.png';
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
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        navigate('/dashboard');
      } else {
        setErrorMsg('Registration failed. Please make sure data is valid.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f4f1ea] overflow-hidden px-4 font-sans text-slate-900">
      <div className="w-full max-w-md z-10">
        
        {/* Logo and Brand Title */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img src={poweriqLogo} alt="PowerIQ" className="h-24 w-auto object-contain mb-1 mix-blend-darken" />
          <p className="text-slate-600 text-xs font-semibold mt-1.5 max-w-xs leading-relaxed uppercase tracking-wider">
            Create an Analyst Account
          </p>
        </div>

        {/* Register Panel */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 text-left">Create Account</h2>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border-2 border-rose-900 text-rose-900 text-xs flex items-start gap-2.5 font-bold uppercase tracking-wide">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="e.g. John Doe"
              leftIcon={<User size={15} />}
              error={errors.name?.message}
              {...register('name')}
            />

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

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-4"
              isLoading={isSubmitting}
            >
              Register & Login
            </Button>
          </form>
        </div>

        {/* Footer actions */}
        <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c5a059] hover:underline hover:text-[#b08c45] transition-colors">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
