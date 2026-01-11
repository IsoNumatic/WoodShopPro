import { useState, useEffect } from 'react';
import { isBefore } from 'date-fns';
import { Project, Phase, getPhaseClass, GanttViewMode } from '../types/project.types';

interface GanttChartProps {
  project: Project;
  onUpdate?: (updatedPhases: Phase[]) => void;
}

export default function GanttChart({ project }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<GanttViewMode>('Week');
  const [tasks, setTasks] = useState<any[]>([]);

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
      </div>
    </div>
  );
}