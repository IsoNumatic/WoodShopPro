import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Project, Phase, FIXED_PHASES } from '../types/project.types';
import toast from 'react-hot-toast';
import { addDays } from 'date-fns';
import localforage from 'localforage';
import { mockProjects } from '../mocks/mockData';

export const useProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      // Use localforage for mock data
      const loadMockProjects = async () => {
        const storedProjects = await localforage.getItem<Project[]>('projects');
        if (storedProjects) {
          setProjects(storedProjects);
        } else {
          // Initialize with mock data
          await localforage.setItem('projects', mockProjects);
          setProjects(mockProjects);
        }
        setLoading(false);
      };
      loadMockProjects();
    } else {
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
    }
  }, [currentUser]);

  return { projects, loading };
};

export const useProjectById = (id: string) => {
  const { currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.companyId || !id) return;

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      const loadMockProject = async () => {
        const storedProjects = await localforage.getItem<Project[]>('projects') || [];
        const foundProject = storedProjects.find(p => p.id === id) || null;
        setProject(foundProject);
        setLoading(false);
      };
      loadMockProject();
    } else {
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
    }
  }, [currentUser, id]);

  return { project, loading };
};

export const useCreateProject = () => {
  const { currentUser } = useAuth();

  const createProject = async (data: { name: string; client: string; startDate: Date }) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      // Mock create
      const customPhases = ['Material Ordering', 'CNC Programming']; // From mockData

      const allPhasesNames = [...FIXED_PHASES, ...customPhases];

      const phases: Phase[] = allPhasesNames.map((name, index) => {
        const start = addDays(data.startDate, index * 3);
        const end = addDays(start, 5);
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

      const projectData: Project = {
        id: `mock-${Date.now()}`,
        ...data,
        phases,
        currentPhaseIndex: 0,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        createdBy: currentUser.uid,
        companyId: currentUser.companyId,
      };

      const storedProjects = await localforage.getItem<Project[]>('projects') || [];
      storedProjects.push(projectData);
      await localforage.setItem('projects', storedProjects);
      toast.success('Mock project created!');
      return projectData.id;
    } else {
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
    }
  };

  return { createProject };
};

export const useUpdateProject = () => {
  const { currentUser } = useAuth();

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      const storedProjects = await localforage.getItem<Project[]>('projects') || [];
      const index = storedProjects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        storedProjects[index] = { ...storedProjects[index], ...updates, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any };
        await localforage.setItem('projects', storedProjects);
        toast.success('Mock project updated!');
      }
    } else {
      await updateDoc(doc(db, `companies/${currentUser.companyId}/projects`, projectId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      toast.success('Project updated!');
    }
  };

  return { updateProject };
};

export const useUpdatePhase = () => {
  const { currentUser } = useAuth();

  const updatePhase = async (projectId: string, phaseIndex: number, phaseUpdates: Partial<Phase>) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      const storedProjects = await localforage.getItem<Project[]>('projects') || [];
      const projectIndex = storedProjects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        const project = storedProjects[projectIndex];
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

        storedProjects[projectIndex] = { ...project, phases: updatedPhases, currentPhaseIndex, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any };
        await localforage.setItem('projects', storedProjects);
        toast.success('Mock phase updated!');
      }
    } else {
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
    }
  };

  return { updatePhase };
};

export const useDeleteProject = () => {
  const { currentUser } = useAuth();

  const deleteProject = async (projectId: string) => {
    if (!currentUser?.companyId) throw new Error('No company ID');

    if (import.meta.env.VITE_MOCK_MODE === 'true') {
      const storedProjects = await localforage.getItem<Project[]>('projects') || [];
      const filtered = storedProjects.filter(p => p.id !== projectId);
      await localforage.setItem('projects', filtered);
      toast.success('Mock project deleted!');
    } else {
      await deleteDoc(doc(db, `companies/${currentUser.companyId}/projects`, projectId));
      toast.success('Project deleted!');
    }
  };

  return { deleteProject };
};