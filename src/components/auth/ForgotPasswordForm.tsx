import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/use-auth';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { sendResetLink } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    if (cooldown > 0) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      };
      
      await sendResetLink(data.email, actionCodeSettings);
      setSuccess(true);
      setCooldown(60);
      
    } catch (err: any) {
      if (err.message && err.message.includes('user-not-found')) {
        // For security reasons, don't reveal if an email exists
        setSuccess(true);
        setCooldown(60);
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
        <p className="text-white/60 mb-8">
          We've sent password reset instructions to your email address. The link will expire shortly.
        </p>
        <Link 
          to="/auth/login"
          className="inline-flex items-center justify-center w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors border border-white/10"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset password</h2>
        <p className="text-white/60">Enter your email and we'll send you a reset link</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-white/80 ml-1">Email address</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              {...register('email')}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 ml-1 mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : cooldown > 0 ? (
            `Wait ${cooldown}s`
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/auth/login" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
