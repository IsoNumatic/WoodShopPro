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
