import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getEnv = (key: string) => {
  return (typeof process !== 'undefined' ? process.env[key] : undefined) || import.meta.env[key];
};

// Firebase web configuration is intentionally public and is required by the
// browser SDK. Keep a deployment-safe fallback so auth still works when a
// Pages build was created without VITE_FIREBASE_* variables.
const FIREBASE_PUBLIC_CONFIG = {
  VITE_FIREBASE_API_KEY: 'AIzaSyA31ve63D8Rc2j9Sq-YMRQ_6tgPyG1xH4Y',
  VITE_FIREBASE_AUTH_DOMAIN: 'ai-rank-806bf.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'ai-rank-806bf',
  VITE_FIREBASE_STORAGE_BUCKET: 'ai-rank-806bf.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '248749803728',
  VITE_FIREBASE_APP_ID: '1:248749803728:web:e2a3fb94ed5c4ba84436d5',
} as const;

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_API_KEY,
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_PROJECT_ID,
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: getEnv('VITE_FIREBASE_APP_ID') || FIREBASE_PUBLIC_CONFIG.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);

// Firebase is a browser service. Initializing it during SSR makes the
// Cloudflare worker evaluate browser-only configuration and APIs.
const app = typeof window !== "undefined" && hasFirebaseConfig
  ? initializeApp(firebaseConfig)
  : null;
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// Persistent login across tabs/restarts
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Auth persistence error:", error);
  });
}
