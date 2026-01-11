import { useParams, Link } from 'react-router-dom';
import { useProjectById, useUpdatePhase } from '../hooks/useProjects';
import PhaseStepper from '../components/PhaseStepper';
import GanttChart from '../components/GanttChart';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProjectById(id!);
  const { updatePhase } = useUpdatePhase();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full"></div></div>;

  if (!project) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Project not found.</p></div>;

  const handlePhaseUpdate = async (phaseIndex: number, updates: any) => {
    await updatePhase(project.id, phaseIndex, updates);
  };

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="text-accent hover:underline">&larr; Back to Projects</Link>
          <h1 className="text-4xl font-extrabold text-fg">{project.name}</h1>
        </div>
        <div className="bg-bg rounded-card shadow-extruded p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-fg">Client</h3>
              <p className="text-muted">{project.client}</p>
            </div>
            <div>
              <h3 className="font-semibold text-fg">Start Date</h3>
              <p className="text-muted">{format(project.startDate, 'PPP')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-fg">Progress</h3>
              <p className="text-muted">{Math.round((project.currentPhaseIndex / project.phases.length) * 100)}%</p>
            </div>
          </div>
        </div>
        <PhaseStepper project={project} onUpdate={handlePhaseUpdate} />
        <GanttChart project={project} />
      </div>
    </div>
  );
}