import { useState, useEffect } from 'react';
import { isBefore } from 'date-fns';
import { Project, Phase, getPhaseClass, GanttViewMode } from '../types/project.types';
import localforage from 'localforage';
import toast from 'react-hot-toast';

interface GanttChartProps {
  project: Project;
  onUpdate?: (updatedPhases: Phase[]) => void;
}

export default function GanttChart({ project, onUpdate }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<GanttViewMode>('Week');
  const [tasks, setTasks] = useState<any[]>([]);

  const handleDateChange = async (task: any, start: Date, end: Date) => {
    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      // Update local phases array
      const updatedPhases = [...project.phases];
      updatedPhases[task.phaseIndex] = {
        ...updatedPhases[task.phaseIndex],
        startDate: start,
        endDate: end,
      };

      // Update localforage
      const storedProjects = await localforage.getItem<Project[]>('projects') || [];
      const projectIndex = storedProjects.findIndex(p => p.id === project.id);
      if (projectIndex !== -1) {
        storedProjects[projectIndex] = { ...storedProjects[projectIndex], phases: updatedPhases };
        await localforage.setItem('projects', storedProjects);
        toast.success('Mock timeline updated');
        onUpdate?.(updatedPhases);
      }
    }
  };

  useEffect(() => {
    // Placeholder: Simulate tasks loading
    const newTasks = project.phases.map((phase, index) => {
      const isOverdue = isBefore(phase.endDate, new Date()) && phase.status !== '✔️ Completed';
      if (isOverdue) phase.status = '⛔ Overdue';

      return {
        id: `${project.id}-${index}`,
        name: `${phase.name} ${phase.status} (${phase.priority})`,
        start: phase.startDate.toISOString(),
        end: phase.endDate.toISOString(),
        progress: phase.progress * 100,
        dependencies: index > 0 ? `${project.id}-${index - 1}` : '',
        custom_class: `${getPhaseClass(phase)} ${isOverdue ? 'overdue' : ''}`,
        phaseIndex: index,
      };
    });
    setTasks(newTasks);
  }, [project.phases]);

  return (
    <div className="bg-bg rounded-card shadow-inset p-6 overflow-x-auto">
      <div className="flex justify-end mb-4 gap-2">
        {['Day', 'Week', 'Month'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as GanttViewMode)}
            className={`px-4 py-2 rounded-btn ${viewMode === mode ? 'bg-accent text-white shadow-inset' : 'bg-bg shadow-extruded hover:shadow-extruded-hover'}`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="text-center py-8">
        <p className="text-muted">Gantt Chart Placeholder - Integration pending library fix</p>
        <p className="text-sm mt-2">Tasks loaded: {tasks.length}</p>
        <p className="text-sm">View Mode: {viewMode}</p>
        {import.meta.env.VITE_MOCK_MODE === 'true' && (
          <button
            onClick={() => handleDateChange(tasks[0], new Date(tasks[0]?.start), new Date(tasks[0]?.end))}
            className="mt-4 px-4 py-2 bg-accent text-white rounded-btn shadow-extruded hover:shadow-extruded-hover"
          >
            Mock Drag Update (Simulate)
          </button>
        )}
      </div>
    </div>
  );
}