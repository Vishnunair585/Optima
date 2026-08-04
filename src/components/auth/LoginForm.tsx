import { useState } from 'react';
import { useAuthContext } from './auth-provider';
import { Link, useNavigate } from '@tanstack/react-router';
import { AuthButtons } from './AuthButtons';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { loginSchema } from './validation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setError(null);
      loginSchema.parse({ email, password });
      
      setLoading(true);
      await login(email, password);
      navigate({ to: '/' });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive-foreground font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full h-11"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand hover:text-brand/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-base font-semibold bg-gradient-brand text-white shadow-lg hover:shadow-brand/25 transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Continue'
          )}
        </Button>
      </form>

      <AuthButtons isSignUp={false} />

      <div className="text-center text-sm text-muted-foreground mt-4">
        New to Optima?{' '}
        <Link to="/signup" className="font-semibold text-brand hover:text-brand/80 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
