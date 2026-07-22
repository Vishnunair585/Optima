import { useState } from 'react';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { AlertCircle, Chrome } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function LoginForm() {
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
      if (details?.isNewUser) {
        // This is a new user trying to log in. They must sign up instead.
        await result.user.delete();
        await auth.signOut();
        setLoading(false);
        setError('Account not found. Please sign up instead.');
        return;
      }

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
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
