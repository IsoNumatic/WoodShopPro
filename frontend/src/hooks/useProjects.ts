import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Project, Phase, FIXED_PHASES } from '../types/project.types';
import toast from 'react-hot-toast';
import { addDays } from 'date-fns';

export const useProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const q = query(collection(db, `companies/${currentUser.companyId}/projects`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          startDate: docData.startDate.toDate(),
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt,
          companyId: currentUser.companyId,
          phases: docData.phases.map((phase: any) => ({
            ...phase,
            startDate: phase.startDate.toDate(),
            endDate: phase.endDate.toDate(),
          })),
        } as Project;
      });
      setProjects(data);
      setLoading(false);
    }, (error) => {
      toast.error(`Failed to load projects: ${error.message}`);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  return { projects, loading };
};

export const useProjectById = (id: string) => {
  const { currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.companyId || !id) return;

    const unsubscribe = onSnapshot(doc(db, `companies/${currentUser.companyId}/projects`, id), (docSnap) => {
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setProject({
          id: docSnap.id,
          ...docData,
          startDate: docData.startDate.toDate(),
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt,
          companyId: currentUser.companyId,
          phases: docData.phases.map((phase: any) => ({
            ...phase,
            startDate: phase.startDate.toDate(),
            endDate: phase.endDate.toDate(),
          })),
        } as Project);
      } else {
        setProject(null);
      }
      setLoading(false);
    }, (error) => {
      toast.error(`Failed to load project: ${error.message}`);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, id]);

  return { project, loading };
};

export const useCreateProject = () => {
  const { currentUser } = useAuth();

  const createProject = async (data: { name: string; client: string; startDate: Date }) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    // Fetch company custom phases
    const companyDoc = await getDoc(doc(db, 'companies', currentUser.companyId));
    const customPhases = companyDoc.data()?.customPhases || [];

    const allPhasesNames = [...FIXED_PHASES, ...customPhases];

    const phases: Phase[] = allPhasesNames.map((name, index) => {
      const start = addDays(data.startDate, index * 3);  // Default 3-day offset
      const end = addDays(start, 5);  // Default 5-day duration
      return {
        name,
        startDate: start,
        endDate: end,
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
    });

    const projectData: Omit<Project, 'id'> = {
      ...data,
      phases,
      currentPhaseIndex: 0,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: currentUser.uid,
      companyId: currentUser.companyId,
    };

    const ref = await addDoc(collection(db, `companies/${currentUser.companyId}/projects`), projectData);
    toast.success('Project created!');
    return ref.id;
  };

  return { createProject };
};

export const useUpdateProject = () => {
  const { currentUser } = useAuth();

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    await updateDoc(doc(db, `companies/${currentUser.companyId}/projects`, projectId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    toast.success('Project updated!');
  };

  return { updateProject };
};

export const useUpdatePhase = () => {
  const { currentUser } = useAuth();

  const updatePhase = async (projectId: string, phaseIndex: number, phaseUpdates: Partial<Phase>) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    const projectRef = doc(db, `companies/${currentUser.companyId}/projects`, projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) throw new Error('Project not found');

    const project = projectSnap.data() as Project;
    const updatedPhases = [...project.phases];
    updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], ...phaseUpdates };

    // Recalculate decision based on important/urgent
    if (phaseUpdates.important !== undefined || phaseUpdates.urgent !== undefined) {
      const phase = updatedPhases[phaseIndex];
      if (phase.important && phase.urgent) {
        phase.decision = 'To Do';
      } else if (phase.important && !phase.urgent) {
        phase.decision = 'To Delegate';
      } else if (!phase.important && phase.urgent) {
        phase.decision = 'To Decide';
      } else {
        phase.decision = 'To Delete';
      }
    }

    // Update currentPhaseIndex if needed
    let currentPhaseIndex = project.currentPhaseIndex;
    const completedCount = updatedPhases.filter(p => p.status === '✔️ Completed').length;
    if (completedCount > currentPhaseIndex) {
      currentPhaseIndex = completedCount;
    }

    await updateDoc(projectRef, {
      phases: updatedPhases,
      currentPhaseIndex,
      updatedAt: serverTimestamp() as any,
    });
    toast.success('Phase updated!');
  };

  return { updatePhase };
};

export const useDeleteProject = () => {
  const { currentUser } = useAuth();

  const deleteProject = async (projectId: string) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    await deleteDoc(doc(db, `companies/${currentUser.companyId}/projects`, projectId));
    toast.success('Project deleted!');
  };

  return { deleteProject };
};