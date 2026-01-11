import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { currentUser, signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-inset-small"></div>
      </div>
    );
  }

  if (currentUser) {
    // If user exists but no company → redirect to onboarding
    if (!currentUser.companyId) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md bg-bg rounded-card shadow-extruded p-10 text-center">
        <h1 className="text-4xl font-extrabold text-fg mb-6">WoodShopPro</h1>
        <p className="text-muted mb-10">Project management for millwork professionals</p>
        {import.meta.env.VITE_MOCK_MODE === 'true' ? (
          <button
            onClick={signInWithGoogle}
            className="w-full bg-accent text-white font-medium rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all duration-300 py-4 px-6 text-lg"
          >
            Mock Login as Admin
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="w-full bg-accent text-white font-medium rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all duration-300 py-4 px-6 text-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              {/* Google logo SVG */}
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.5h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.09-1.92 3.29-4.74 3.29-8.33z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z"/>
              <path fill="#EA4335" d="M12 4.98c1.58 0 3- .52 4.12-1.41l3.37-3.37C17.46 0.98 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84C6.71 6.91 9.14 4.98 12 4.98z"/>
            </svg>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}