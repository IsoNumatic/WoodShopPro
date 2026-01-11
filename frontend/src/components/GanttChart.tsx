import { useState, useEffect } from 'react';
import Gantt from 'frappe-gantt-react';
import { formatISO, addDays, isBefore } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Project, Phase, getPhaseClass, GanttViewMode } from '../types/project.types';
import toast from 'react-hot-toast';
import '../styles/gantt-custom.css';

interface GanttChartProps {
  project: Project;
  onUpdate?: (updatedPhases: Phase[]) => void;
}

export default function GanttChart({ project }: GanttChartProps) {
  const { isAdmin } = useAuth();
  const [viewMode, setViewMode] = useState<GanttViewMode>('Week');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const newTasks = project.phases.map((phase, index) => {
      const isOverdue = isBefore(phase.endDate, new Date()) && phase.status !== '✔️ Completed';
      if (isOverdue) phase.status = '⛔ Overdue';

      return {
        id: `${project.id}-${index}`,
        name: `${phase.name} ${phase.status} (${phase.priority})`,
        start: formatISO(phase.startDate),
        end: formatISO(phase.endDate),
        progress: phase.progress * 100,
        dependencies: index > 0 ? `${project.id}-${index - 1}` : '',
        custom_class: `${getPhaseClass(phase)} ${isOverdue ? 'overdue' : ''}`,
        phaseIndex: index,
      };
    });
    setTasks(newTasks);
  }, [project.phases]);

  const handleDateChange = async (task: any, start: Date, end: Date) => {
    if (!isAdmin) return toast.error('Only admins can edit');

    try {
      const phaseIndex = task.phaseIndex;
      const updatedPhases = [...project.phases];
      updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], startDate: start, endDate: end };

      // Propagate: Shift subsequent phases
      for (let i = phaseIndex + 1; i < updatedPhases.length; i++) {
        updatedPhases[i].startDate = addDays(updatedPhases[i-1].endDate, 1);
        updatedPhases[i].endDate = addDays(updatedPhases[i].startDate, updatedPhases[i].endDate.getTime() - updatedPhases[i].startDate.getTime());  // Maintain duration
      }

      await updateDoc(doc(db, `companies/${project.companyId}/projects`, project.id), { phases: updatedPhases });
      toast.success('Timeline updated');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        on_date_change={isAdmin ? handleDateChange : undefined}
        on_progress_change={isAdmin ? (task, progress) => { /* Optional: Update progress */ } : undefined}
        on_view_change={(mode) => setViewMode(mode)}
        custom_popup_html={(task) => `
          <div class="p-4 bg-bg rounded-card shadow-extruded">
            <h3 class="font-bold">${task.name}</h3>
            <p>Start: ${task.start}</p>
            <p>End: ${task.end}</p>
            <p>Progress: ${task.progress}%</p>
            <p>Person: ${project.phases[task.phaseIndex].personInCharge}</p>
            <p>Notes: ${project.phases[task.phaseIndex].notes.slice(0, 50)}...</p>
          </div>
        `}
      />
    </div>
  );
}