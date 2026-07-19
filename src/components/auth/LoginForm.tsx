import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { Mail, Lock, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Let the useAuth hook handle profile syncing and then redirect
      navigate({ to: '/' });
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: any) => {
    try {
      setError(null);
      // Do not setLoading(true) before popup to prevent popup blockers
      await signInWithPopup(auth, provider);
      setLoading(true);
      navigate({ to: '/' });
    } catch (err: any) {
      setLoading(false);
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add it to your Firebase Console settings.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">Log in to your Optima account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground ml-1">Email address</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              {...register('email')}
              className="w-full bg-background border border-input rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive ml-1 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground ml-1">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full bg-background border border-input rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive ml-1 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-input rounded bg-background group-hover:border-brand/50 transition-colors">
              <input type="checkbox" {...register('rememberMe')} className="peer sr-only" />
              <div className="hidden peer-checked:block w-3 h-3 bg-brand rounded-sm"></div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
          </label>

          <Link to="/forgot-password" className="text-sm text-brand hover:text-brand/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-brand text-brand-foreground rounded-xl font-medium shadow-lg shadow-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-muted-foreground bg-card">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleOAuthSignIn(googleProvider)}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all disabled:opacity-50 font-medium"
            aria-label="Continue with Google"
          >
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-brand hover:text-brand/80 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
