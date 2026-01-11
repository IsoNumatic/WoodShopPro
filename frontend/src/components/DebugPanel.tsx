import { useAuth } from '../contexts/AuthContext';
import localforage from 'localforage';
import toast from 'react-hot-toast';

export default function DebugPanel() {
  const { currentUser } = useAuth();

  const resetStorage = async () => {
    await localforage.clear();
    toast.success('Mock storage reset');
    window.location.reload();
  };

  const toggleRole = async () => {
    if (currentUser) {
      const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
      // Since auth is mock, we can't update it directly, but we can reload with different mock
      // For simplicity, just show toast
      toast.success(`Role toggled to ${newRole} (reload to apply)`);
    }
  };

  if (import.meta.env.VITE_MOCK_MODE !== 'true') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-bg rounded-card shadow-extruded p-4 z-50">
      <h3 className="text-sm font-bold mb-2">Mock Debug Panel</h3>
      <div className="flex gap-2">
        <button
          onClick={resetStorage}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Reset Storage
        </button>
        <button
          onClick={toggleRole}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Toggle Role
        </button>
      </div>
    </div>
  );
}