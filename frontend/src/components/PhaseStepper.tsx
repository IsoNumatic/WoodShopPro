import { useState } from 'react';
import { Project, Phase, PhaseStatus, PhasePriority, KanbanCategory } from '../types/project.types';
import { useAuth } from '../contexts/AuthContext';
import { useUpdateProject } from '../hooks/useProjects';
import { format, isAfter, addDays } from 'date-fns';

interface PhaseStepperProps {
  project: Project;
  onUpdate: (phaseIndex: number, updates: Partial<Phase>) => void;
}

export default function PhaseStepper({ project, onUpdate }: PhaseStepperProps) {
  const { isAdmin } = useAuth();
  const { updateProject } = useUpdateProject();
  const [editingPhase, setEditingPhase] = useState<number | null>(null);
  const [newPhaseName, setNewPhaseName] = useState('');

  const handleEdit = (index: number) => {
    setEditingPhase(index);
  };

  const handleSave = (index: number, updates: Partial<Phase>) => {
    onUpdate(index, updates);
    setEditingPhase(null);
  };

  const handleAddPhase = async () => {
    if (!newPhaseName.trim()) return;
    const position = parseInt(prompt('Enter position to insert (0-based index, e.g., 0 for beginning):') || '0');
    const insertIndex = Math.max(0, Math.min(position, project.phases.length));

    const newPhase: Phase = {
      name: newPhaseName,
      startDate: insertIndex > 0 ? addDays(project.phases[insertIndex - 1].endDate, 1) : new Date(),
      endDate: insertIndex > 0 ? addDays(project.phases[insertIndex - 1].endDate, 6) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      status: '🚩 To do',
      priority: 'Medium',
      personInCharge: '',
      kanbanCategory: 'Backlog',
      important: false,
      urgent: false,
      decision: 'To Decide',
      progress: 0,
      notes: '',
    };

    const updatedPhases = [
      ...project.phases.slice(0, insertIndex),
      newPhase,
      ...project.phases.slice(insertIndex).map(phase => ({
        ...phase,
        startDate: addDays(phase.startDate, 1), // Shift subsequent
        endDate: addDays(phase.endDate, 1),
      }))
    ];

    await updateProject(project.id, { phases: updatedPhases });
    setNewPhaseName('');
  };

  const getStatusColor = (status: PhaseStatus) => {
    switch (status) {
      case '✔️ Completed': return 'bg-green-500';
      case '📈 In progress': return 'bg-blue-500';
      case '⛔ Overdue': return 'bg-red-500';
      case '⏸️ Hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-fg">Project Phases</h2>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto">
        {project.phases.map((phase, index) => {
          const isOverdue = isAfter(new Date(), phase.endDate) && phase.status !== '✔️ Completed' && phase.status !== '❌ Canceled';
          const effectiveStatus = isOverdue ? '⛔ Overdue' : phase.status;
          const isActive = index === project.currentPhaseIndex;
          const isCompleted = phase.status === '✔️ Completed';

          return (
            <div key={index} className={`min-w-80 bg-bg rounded-card shadow-extruded p-6 ${isActive ? 'ring-2 ring-accent' : ''} ${isCompleted ? 'shadow-inset' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-fg">{phase.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(effectiveStatus)} text-white`}>{effectiveStatus}</span>
              </div>
              {editingPhase === index ? (
                <EditPhaseForm phase={phase} onSave={(updates) => handleSave(index, updates)} onCancel={() => setEditingPhase(null)} />
              ) : (
                <div className="space-y-2 text-sm">
                  <p><strong>Priority:</strong> {phase.priority}</p>
                  <p><strong>Person:</strong> {phase.personInCharge || 'Unassigned'}</p>
                  <p><strong>Kanban:</strong> {phase.kanbanCategory}</p>
                  <p><strong>Decision:</strong> {phase.decision}</p>
                  <p><strong>Progress:</strong> {Math.round(phase.progress * 100)}%</p>
                  <p><strong>Dates:</strong> {format(phase.startDate, 'MM/dd')} - {format(phase.endDate, 'MM/dd')}</p>
                  {phase.notes && <p><strong>Notes:</strong> {phase.notes}</p>}
                  <button onClick={() => handleEdit(index)} className="mt-4 bg-accent text-white px-3 py-1 rounded shadow-extruded hover:shadow-extruded-hover transition-all">Edit</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isAdmin && (
        <div className="bg-bg rounded-card shadow-extruded p-6">
          <h3 className="text-lg font-semibold mb-4">Add Custom Phase</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              placeholder="Phase name"
              className="flex-1 bg-bg rounded-btn shadow-inset-deep p-2"
            />
            <button onClick={handleAddPhase} className="bg-accent text-white px-4 py-2 rounded-btn shadow-extruded hover:shadow-extruded-hover transition-all">Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditPhaseForm({ phase, onSave, onCancel }: { phase: Phase; onSave: (updates: Partial<Phase>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    ...phase,
    startDate: format(phase.startDate, 'yyyy-MM-dd'),
    endDate: format(phase.endDate, 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };
    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as PhaseStatus })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        >
          <option value="🚩 To do">🚩 To do</option>
          <option value="📈 In progress">📈 In progress</option>
          <option value="⏸️ Hold">⏸️ Hold</option>
          <option value="📝 To review">📝 To review</option>
          <option value="✅ Started">✅ Started</option>
          <option value="⛔ Overdue">⛔ Overdue</option>
          <option value="❌ Canceled">❌ Canceled</option>
          <option value="✔️ Completed">✔️ Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as PhasePriority })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        >
          <option value="Very High">Very High</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Very Low">Very Low</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Person in Charge</label>
        <input
          type="text"
          value={formData.personInCharge}
          onChange={(e) => setFormData({ ...formData, personInCharge: e.target.value })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Kanban Category</label>
        <select
          value={formData.kanbanCategory}
          onChange={(e) => setFormData({ ...formData, kanbanCategory: e.target.value as KanbanCategory })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        >
          <option value="Backlog">Backlog</option>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.important}
            onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
          />
          Important
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.urgent}
            onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
          />
          Urgent
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Progress (0-1)</label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: parseFloat(e.target.value) })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full bg-bg rounded-btn shadow-inset-deep p-2 h-20"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded-btn shadow-extruded hover:shadow-extruded-hover transition-all">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-btn shadow-extruded hover:shadow-extruded-hover transition-all">Cancel</button>
      </div>
    </form>
  );
}