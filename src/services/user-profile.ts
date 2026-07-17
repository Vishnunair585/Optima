import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Premium User' | 'Free User' | 'Guest';
export type AccountStatus = 'Active' | 'Pending Verification' | 'Suspended' | 'Disabled' | 'Deleted' | 'Banned' | 'Blocked';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
  emailVerified: boolean;
  createdAt: any;
  lastLogin: any;
  role: UserRole;
  status: AccountStatus;
  subscriptionPlan: string;
  preferences: Record<string, any>;
  deviceInfo?: Record<string, any>;
  acceptedTermsVersion?: string;
  acceptedPrivacyVersion?: string;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfile = async (user: FirebaseUser, providerId: string = 'password') => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingProfile = await getDoc(userRef);

    if (!existingProfile.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: providerId,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'Free User',
        status: user.emailVerified ? 'Active' : 'Pending Verification',
        subscriptionPlan: 'Free',
        preferences: {},
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    }
    return existingProfile.data() as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateLastLogin = async (uid: string, deviceInfo?: Record<string, any>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      ...(deviceInfo && { deviceInfo })
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};
