import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  sendEmailVerification,
  verifyPasswordResetCode,
  confirmPasswordReset,
  ActionCodeSettings
} from "firebase/auth";
import { syncUserFn } from "../../lib/api/users.functions";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role?: string;
  email_verified: boolean;
  onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password?: string, username?: string) => Promise<boolean>;
  logout: () => void;
  sendResetLink: (email: string, actionCodeSettings?: ActionCodeSettings) => Promise<boolean>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmResetPassword: (password: string, code: string) => Promise<boolean>;
  updateAvatar: (avatarBase64: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<void>;
  updateUsername: (newName: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;

  // OAuth methods
  loginWithGoogle: () => Promise<boolean>;
  loginWithGitHub: () => Promise<boolean>;
  loginWithX: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to app User interface
        // Optionally fetch extra details from Supabase
        
        const localAvatar = localStorage.getItem(`user_avatar_${firebaseUser.uid}`);
        let appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          avatar: localAvatar || firebaseUser.photoURL,
          email_verified: firebaseUser.emailVerified,
          onboarded: true,
          role: "user"
        };
        
        try {
          const syncResult = await syncUserFn({ data: { uid: firebaseUser.uid, email: firebaseUser.email || "", name: appUser.name, avatar: appUser.avatar } });
          if (syncResult) {
            if (syncResult.role) appUser.role = syncResult.role;
            if (syncResult.onboarded !== undefined) appUser.onboarded = syncResult.onboarded;
          }
        } catch (e) {
          console.error("Failed to sync user with Firestore:", e);
        }
        
        setUser(appUser);
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Rate Limiting State for Login
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const checkRateLimit = () => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      throw new Error(`Too many login attempts. Please try again in ${remainingSeconds} seconds.`);
    }
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    if (newAttempts >= 5) {
      // Lock out for 60 seconds after 5 failed attempts
      setLockoutUntil(Date.now() + 60000);
      setLoginAttempts(0); // Reset attempts after locking out
    }
  };

  const login = async (email: string, password?: string) => {
    checkRateLimit();
    if (!password) throw new Error("Password is required");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Reset on success
      setLoginAttempts(0);
      setLockoutUntil(null);
      toast.success("Welcome back!");
      return true;
    } catch (err: any) {
      handleFailedLogin();
      throw new Error(err.message || "Login failed");
    }
  };

  const signUp = async (email: string, password?: string, username?: string) => {
    if (!password) throw new Error("Password is required");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (username) {
        await updateProfile(firebaseUser, { displayName: username });
      }
      
      // Removed insecure client-side Supabase insert for security reasons.
      // Database synchronization should occur via a secure backend webhook on user creation.
      
      try {
        await sendEmailVerification(firebaseUser);
        toast.success("Account created! Verification email sent.");
      } catch (e) {
        toast.success("Account created successfully!");
      }
      
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Sign up failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  const sendResetLink = async (email: string, actionCodeSettings?: ActionCodeSettings) => {
    try {
      // Use our backend function which generates a Firebase Admin reset link and sends via Nodemailer.
      // This bypasses Firebase Client SDK's domain whitelist requirements and uses our custom template.
      const { requestPasswordResetFn } = await import("../../lib/api/auth.functions");
      const result = await requestPasswordResetFn({ data: { email } });
      if (result && result.success) {
        toast.success("Password reset link sent! Check your email.");
        return true;
      } else {
        throw new Error("Failed to send reset link via backend");
      }
    } catch (err: any) {
      console.error("[Auth] sendResetLink error:", err);
      throw new Error(err.message || "Failed to send reset link");
    }
  };

  const verifyResetCode = async (code: string) => {
    try {
      // Local enterprise tokens are 64 char hex strings
      if (code.length === 64 && /^[0-9a-f]+$/i.test(code)) {
        const { validateResetTokenFn } = await import("../../lib/api/auth.functions");
        const res = await validateResetTokenFn({ data: { token: code } });
        if (res.valid) return "your account";
        throw new Error("Invalid token");
      }
      return await verifyPasswordResetCode(auth, code);
    } catch (err: any) {
      throw new Error(err.message || "Invalid or expired reset link");
    }
  };

  const confirmResetPassword = async (password: string, code: string) => {
    try {
      if (code.length === 64 && /^[0-9a-f]+$/i.test(code)) {
        const { resetPasswordFn } = await import("../../lib/api/auth.functions");
        await resetPasswordFn({ data: { token: code, password } });
        toast.success("Password has been reset successfully!");
        return true;
      }
      await confirmPasswordReset(auth, code, password);
      toast.success("Password has been reset successfully!");
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Failed to reset password");
    }
  };

  const updateAvatar = async (avatarBase64: string) => {
    if (!auth.currentUser) return false;
    try {
      // Firebase auth photoURL max length is 2048 chars
      if (avatarBase64.length < 2048) {
        await updateProfile(auth.currentUser, { photoURL: avatarBase64 });
      } else {
        // Fallback: save locally if it's a huge base64
        localStorage.setItem(`user_avatar_${auth.currentUser.uid}`, avatarBase64);
      }
      
      try {
        // Also update in Firestore
        await syncUserFn({ data: { uid: auth.currentUser.uid, email: auth.currentUser.email || "", name: auth.currentUser.displayName || "", avatar: avatarBase64 } });
      } catch (e) {
        console.warn("Could not sync avatar to Firestore", e);
      }
      
      // Force refresh user object
      setUser(prev => prev ? { ...prev, avatar: avatarBase64 } : null);
      toast.success("Profile picture updated!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile picture");
      return false;
    }
  };

  const updateUsername = async (newName: string) => {
    if (!auth.currentUser) return false;
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      
      try {
        // Also update in Firestore
        await syncUserFn({ data: { uid: auth.currentUser.uid, email: auth.currentUser.email || "", name: newName, avatar: auth.currentUser.photoURL } });
      } catch (e) {
        console.warn("Could not sync username to Firestore", e);
      }
      
      setUser(prev => prev ? { ...prev, name: newName } : null);
      toast.success("Username updated!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update username");
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    toast.error("Firebase uses email link verification instead of OTP.");
    return false;
  };

  const resendOtp = async (email: string) => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent.");
    }
  };

  const refreshSession = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Removed insecure client-side Supabase upsert for security reasons.
      // Database synchronization should occur via a secure backend webhook on user login/creation.
      
      toast.success("Logged in with Google!");
      return true;
    } catch (err: any) {
      if (err.code === 'auth/internal-error' || err.message.includes('internal-error')) {
        toast.error("Google Sign-In is disabled. Please enable it in your Firebase Console > Authentication > Sign-in method.", { duration: 8000 });
      } else {
        toast.error(err.message || "Google login failed");
      }
      return false;
    }
  };

  const loginWithGitHub = async () => {
    try {
      const { GithubAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Removed insecure client-side Supabase upsert for security reasons.
      // Database synchronization should occur via a secure backend webhook on user login/creation.
      
      toast.success("Logged in with GitHub!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "GitHub login failed");
      return false;
    }
  };

  const loginWithX = async () => { toast.info("X login requires Firebase UI config"); return false; };
  const loginWithApple = async () => { toast.info("Apple login requires Firebase UI config"); return false; };

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      isSignedIn: !!user,
      login,
      signUp,
      logout,
      sendResetLink,
      verifyResetCode,
      confirmResetPassword,
      updateAvatar,
      updateUsername,
      verifyOtp,
      resendOtp,
      refreshSession,
      loginWithGoogle,
      loginWithGitHub,
      loginWithX,
      loginWithApple,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
