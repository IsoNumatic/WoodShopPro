import { Timestamp } from 'firebase/firestore';

export const FIXED_PHASES = [
  'Estimating',
  'Bidding',
  'Shop Drawings',
  'Approval/Procurement',
  'Programming',
  'Building/Fabrication',
  'Staging/QC',
  'Delivery/Install',
  'Closeout',
] as const;

export type PhaseStatus = '🚩 To do' | '📈 In progress' | '⏸️ Hold' | '📝 To review' | '✅ Started' | '⛔ Overdue' | '❌ Canceled' | '✔️ Completed';
export type PhasePriority = 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low' | 'On Hold';
export type KanbanCategory = 'Backlog' | 'To-Do' | 'In Progress' | 'Review' | 'Done';

export interface Phase {
  name: string;
  startDate: Date;
  endDate: Date;
  status: PhaseStatus;
  priority: PhasePriority;
  personInCharge: string;  // UID or name
  kanbanCategory: KanbanCategory;
  important: boolean;
  urgent: boolean;
  decision: 'To Do' | 'To Delegate' | 'To Decide' | 'To Delete';  // Derived from important/urgent
  progress: number;  // 0 to 1
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: Date;
  phases: Phase[];
  currentPhaseIndex: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;  // UID
  companyId: string;
}

export type GanttViewMode = 'Day' | 'Week' | 'Month';

export const getPhaseClass = (phase: Phase) => {
  if (phase.status === '⛔ Overdue') return 'overdue';
  switch (phase.priority) {
    case 'Very High': return 'very-high';
    case 'High': return 'high';
    case 'Medium': return 'medium';
    case 'Low': return 'low';
    default: return 'default';
  }
};