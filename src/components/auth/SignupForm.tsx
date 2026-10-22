import { useState } from 'react';
import { useAuthContext } from './auth-provider';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AlertCircle, Chrome } from 'lucide-react';
import { z } from 'zod';
import { signupSchema } from './validation';

export function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle, signUp } = useAuthContext();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setError(null);
      signupSchema.parse({ fullName, acceptTerms });
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      setLoading(true);
      await signUp(email, password, fullName);
      navigate({ to: '/onboarding' });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Failed to create an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupWithGoogle = async () => {
    if (loading) return;

    try {
      setError(null);
      signupSchema.parse({ fullName, acceptTerms });
      
      setLoading(true);
      const result = await loginWithGoogle({ isSignUpFlow: true, username: fullName });
      
      if (typeof result === "object" && result.success) {
        navigate({ to: '/onboarding' });
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Failed to create an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div data-testid="signup-error-alert" className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive-foreground font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleEmailSignUp} noValidate className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            User Name
          </label>
          <Input
            id="fullName"
            data-testid="signup-username-input"
            type="text"
            autoComplete="name"
            placeholder="Choose a username"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full h-11"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="signupEmail" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="signupEmail"
            data-testid="signup-email-input"
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
          <label htmlFor="signupPassword" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="signupPassword"
            data-testid="signup-password-input"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full h-11"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 pb-1">
          <input
            id="terms"
            data-testid="signup-terms-checkbox"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none">
            I agree to the{' '}
            <Link to="/legal/terms" className="text-foreground hover:text-brand transition-colors underline decoration-border underline-offset-4">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/legal/privacy" className="text-foreground hover:text-brand transition-colors underline decoration-border underline-offset-4">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          data-testid="signup-submit-btn"
          disabled={loading}
          className="w-full h-11 text-base font-semibold bg-gradient-brand text-white shadow-lg hover:shadow-brand/25 transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        data-testid="signup-google-btn"
        onClick={handleSignupWithGoogle}
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 h-11 text-base border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all disabled:opacity-50 font-medium shadow-sm group"
      >
        <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Sign up with Google
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand hover:text-brand/80 transition-colors">
          Log In
        </Link>
      </div>
    </div>
  );
}
