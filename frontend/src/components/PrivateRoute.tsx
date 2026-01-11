import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full"></div></div>;

  if (!currentUser) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}