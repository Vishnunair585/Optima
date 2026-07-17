import admin from 'firebase-admin';

if (!admin?.apps?.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
      });
    } else {
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin?.apps?.length > 0 ? admin.auth() : null;
export const adminDb = admin?.apps?.length > 0 ? admin.firestore() : null;
