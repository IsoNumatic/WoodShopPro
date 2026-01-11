import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-accent text-white px-4 py-2 rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all"
          >
            Logout
          </button>
        </div>
        <div className="bg-bg rounded-card shadow-extruded p-6">
          <p className="text-muted">Welcome, {currentUser?.displayName}!</p>
          <p className="text-muted">Role: {currentUser?.role}</p>
          <p className="text-muted">Company ID: {currentUser?.companyId}</p>
        </div>
      </div>
    </div>
  );
}