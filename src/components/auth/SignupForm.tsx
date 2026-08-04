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
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthContext();

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
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive-foreground font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            User Name
          </label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Choose a username"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full h-11"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 pb-1">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand"
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
          type="button"
          onClick={handleSignupWithGoogle}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 h-11 text-base border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all disabled:opacity-50 font-medium shadow-sm group mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
          ) : (
            <>
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sign up with Google
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand hover:text-brand/80 transition-colors">
          Log In
        </Link>
      </div>
    </div>
  );
}
