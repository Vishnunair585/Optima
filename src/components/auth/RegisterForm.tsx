import { useState } from 'react';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { AlertCircle, Chrome } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { createUserProfile } from '../../services/user-profile';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOAuthSignIn = async (provider: any) => {
    try {
      setError(null);
      // Do not setLoading(true) before popup to prevent popup blockers
      const result = await signInWithPopup(auth, provider);
      setLoading(true);

      const details = getAdditionalUserInfo(result);
      if (!details?.isNewUser) {
        // This is an existing user trying to sign up. They must log in instead.
        await auth.signOut();
        setLoading(false);
        setError('An account with this email already exists. Please log in.');
        return;
      }

      // Ensure profile exists
      await createUserProfile(result.user, provider.providerId);
      
      navigate({ to: '/onboarding' });
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
        <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">Join Optima and start building today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}

      <div className="mt-2">
        <button
          onClick={() => handleOAuthSignIn(googleProvider)}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all disabled:opacity-50 font-medium shadow-sm"
          aria-label="Continue with Google"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
          ) : (
            <>
              <Chrome className="w-5 h-5" />
              Sign up with Google
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <span className="text-xs text-muted-foreground leading-tight">
          By signing up, I acknowledge that I have read and agree to the Optima <Link to="/legal/terms" className="text-brand hover:underline" target="_blank">Terms of Service</Link> and <Link to="/legal/privacy" className="text-brand hover:underline" target="_blank">Privacy Policy</Link>.
        </span>
      </div>
    </div>
  );
}
