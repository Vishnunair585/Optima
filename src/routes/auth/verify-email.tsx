import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../../hooks/use-auth';
import { Mail, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // If no user is logged in, send them to login
    if (!user && profile === null) {
      navigate({ to: '/auth/login' });
      return;
    }

    // If user is already verified, send them to dashboard
    if (user?.emailVerified || profile?.status === 'Active') {
      navigate({ to: '/' });
    }
  }, [user, profile, navigate]);

  const handleResend = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setMessage(null);
      await sendEmailVerification(user);
      setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setMessage({ type: 'error', text: 'Too many requests. Please wait a bit before trying again.' });
      } else {
        setMessage({ type: 'error', text: err.message || 'Failed to send verification email.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.reload(); // Reload user data from Firebase
      if (user.emailVerified) {
        navigate({ to: '/' }); // or trigger context refresh
      } else {
        setMessage({ type: 'error', text: 'Email is still not verified. Please check your inbox.' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Verify your email</h2>
        <p className="text-white/60 mb-6">
          We've sent a verification link to <span className="text-white font-medium">{user?.email}</span>. 
          Please verify your email address before accessing Optima.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-200' 
              : 'bg-red-500/10 border-red-500/20 text-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-left">{message.text}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            I've verified my email
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 transition-colors disabled:opacity-50"
          >
            Resend Verification Email
          </button>
        </div>

        <div className="mt-8 text-sm">
          <button 
            onClick={() => useAuth().signOut()}
            className="text-white/50 hover:text-white transition-colors"
          >
            Sign in with a different account
          </button>
        </div>
      </div>
    </div>
  );
}
