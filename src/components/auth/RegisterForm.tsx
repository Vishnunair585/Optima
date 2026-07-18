import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { Mail, Lock, User, AlertCircle, Chrome, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { createUserProfile } from '../../services/user-profile';

// Password must contain at least 12 chars, uppercase, lowercase, number, and special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().regex(passwordRegex, 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and privacy policy" }),
  }),
  newsletter: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { newsletter: false }
  });

  const passwordValue = watch('password', '');
  
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 0) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update basic profile via Firebase auth (displayName) if needed, but we manage it in Firestore
      // Create Firestore user profile
      await createUserProfile({
        ...userCredential.user,
        displayName: data.fullName,
        emailVerified: false,
      } as any, 'password');

      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Redirect to verification page
      navigate({ to: '/auth/verify-email' });
      
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: any) => {
    try {
      setError(null);
      // Do not setLoading(true) before popup to prevent popup blockers
      const result = await signInWithPopup(auth, provider);
      setLoading(true);
      // Ensure profile exists
      await createUserProfile(result.user, provider.providerId);
      
      navigate({ to: '/' });
    } catch (err: any) {
      setLoading(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`Failed to sign in with provider. ${err.message}`);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              {...register('fullName')}
              className="w-full bg-background border border-input rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && <p className="text-xs text-destructive ml-1 mt-1">{errors.fullName.message}</p>}
        </div>

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
          {passwordValue && (
            <div className="flex gap-1 mt-2 mb-1 px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`h-1 w-full rounded-full ${
                    i <= strength 
                      ? (strength < 3 ? 'bg-destructive' : strength < 5 ? 'bg-warning' : 'bg-success')
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive ml-1 mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground ml-1">Confirm Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full bg-background border border-input rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              placeholder="••••••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive ml-1 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-2 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-input rounded bg-background mt-0.5 group-hover:border-brand/50 transition-colors shrink-0">
              <input type="checkbox" {...register('acceptTerms')} className="peer sr-only" />
              <div className="hidden peer-checked:block w-3 h-3 bg-brand rounded-sm"></div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              By creating an account, I acknowledge that I have read and agree to the Optima <Link to="/legal/terms" className="text-brand hover:underline" target="_blank">Terms of Service</Link> and <Link to="/legal/privacy" className="text-brand hover:underline" target="_blank">Privacy Policy</Link>.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-xs text-destructive ml-8">{errors.acceptTerms.message}</p>}

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-input rounded bg-background mt-0.5 group-hover:border-brand/50 transition-colors shrink-0">
              <input type="checkbox" {...register('newsletter')} className="peer sr-only" />
              <div className="hidden peer-checked:block w-3 h-3 bg-brand rounded-sm"></div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              Subscribe to Optima newsletter for product updates
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 mt-4 bg-gradient-brand text-brand-foreground rounded-xl font-medium shadow-lg shadow-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-muted-foreground bg-card">Or sign up with</span>
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
            Sign up with Google
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-brand hover:text-brand/80 transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
