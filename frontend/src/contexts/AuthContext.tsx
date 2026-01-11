import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types/user.types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      // Simulate signed-in user
      setCurrentUser({
        uid: 'mock-uid',
        email: 'mock@test.com',
        displayName: 'Mock User',
        photoURL: null,
        role: 'admin', // Toggle to 'user' for testing
        companyId: 'mock-company',
        createdAt: new Date(),
      });
      setLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        setLoading(true);
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setCurrentUser(userSnap.data() as User);
          } else {
            // New user → trigger onboarding (handled in UI)
            toast('Welcome! Please complete your profile.', { icon: '👋' });
            setCurrentUser(null); // Will show onboarding in UI
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const signInWithGoogle = async () => {
    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      setCurrentUser({
        uid: 'mock-uid',
        email: 'mock@test.com',
        displayName: 'Mock User',
        photoURL: null,
        role: 'admin',
        companyId: 'mock-company',
        createdAt: new Date(),
      });
      toast.success('Mock login successful');
    } else {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
        toast.error(`Sign in failed: ${error.message}`);
        console.error(error);
      }
    }
  };

  const logout = async () => {
    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      setCurrentUser(null);
      toast.success('Mock logout successful');
    } else {
      try {
        await signOut(auth);
        toast.success('Logged out successfully');
      } catch (error: any) {
        toast.error(`Logout failed: ${error.message}`);
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};