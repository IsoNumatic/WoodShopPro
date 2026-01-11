import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// @ts-ignore
import MockFirebase from 'firebase-mock';

let app: any;
let auth: any;
let db: any;
let storage: any;
let googleProvider: any;

if (import.meta.env.VITE_MOCK_MODE === 'true') {
  const mockSdk = new MockFirebase();
  app = mockSdk.app();
  auth = mockSdk.auth();
  db = mockSdk.firestore();
  storage = mockSdk.storage();
  googleProvider = new GoogleAuthProvider(); // Still needed for types, but not used
  // Simulate auth
  (auth as any).mockCurrentUser = { uid: 'mock-uid', email: 'test@example.com', companyId: 'mock-company' };
} else {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, db, storage, googleProvider };