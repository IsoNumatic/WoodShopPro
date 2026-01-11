import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProjectDetail from './pages/ProjectDetail';
import DebugPanel from './components/DebugPanel';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      {import.meta.env.VITE_MOCK_MODE === 'true' && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm">
          Running in Mock Mode – Data stored locally in browser
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Route>
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
        <DebugPanel />
      </Router>
    </AuthProvider>
  );
}

export default App;
