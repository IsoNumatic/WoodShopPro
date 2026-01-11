import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';

export default function Dashboard() {
  const { logout, isAdmin } = useAuth();
  const { projects, loading } = useProjects();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-fg">Projects</h1>
          <button
            onClick={logout}
            className="bg-accent text-white px-4 py-2 rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all"
          >
            Logout
          </button>
        </div>
        {isAdmin && <ProjectForm onSuccess={() => {}} />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <div className="bg-bg rounded-card shadow-extruded hover:shadow-extruded-hover hover:-translate-y-2 transition-all duration-300 p-6">
                <h2 className="text-2xl font-bold mb-2 text-fg">{project.name}</h2>
                <p className="text-muted mb-4">Client: {project.client}</p>
                <div className="relative bg-bg rounded-xl shadow-inset h-2 w-full">
                  <div
                    className="absolute top-0 left-0 h-full rounded-xl bg-teal-500"
                    style={{ width: `${(project.currentPhaseIndex / project.phases.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted mt-2">Progress: {Math.round((project.currentPhaseIndex / project.phases.length) * 100)}%</p>
              </div>
            </Link>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-muted text-lg">No projects yet. {isAdmin ? 'Create your first project above!' : 'Ask an admin to create one.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}