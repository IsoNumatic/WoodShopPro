import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '../firebase';
import { addDoc, collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const createCompanySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
});

const joinCompanySchema = z.object({
  companyCode: z.string().min(1, 'Company code is required'),
});

type CreateCompanyForm = z.infer<typeof createCompanySchema>;
type JoinCompanyForm = z.infer<typeof joinCompanySchema>;

export default function Onboarding() {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<CreateCompanyForm>({
    resolver: zodResolver(createCompanySchema),
  });

  const joinForm = useForm<JoinCompanyForm>({
    resolver: zodResolver(joinCompanySchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentUser || currentUser.companyId) {
    return <Navigate to="/dashboard" replace />;
  }

  const onCreateCompany = async (data: CreateCompanyForm) => {
    setIsSubmitting(true);
    try {
      const companyRef = await addDoc(collection(db, 'companies'), {
        name: data.companyName,
        admins: [currentUser.uid],
        customPhases: [],
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        role: 'admin',
        companyId: companyRef.id,
        createdAt: serverTimestamp(),
      });

      toast.success('Company created successfully!');
      // The auth context will update and redirect
    } catch (error: any) {
      toast.error(`Failed to create company: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onJoinCompany = async (data: JoinCompanyForm) => {
    setIsSubmitting(true);
    try {
      const companyRef = doc(db, 'companies', data.companyCode);
      const companySnap = await getDoc(companyRef);

      if (!companySnap.exists()) {
        toast.error('Company not found. Please check the code.');
        return;
      }

      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        role: 'user',
        companyId: data.companyCode,
        createdAt: serverTimestamp(),
      });

      toast.success('Joined company successfully!');
      // The auth context will update and redirect
    } catch (error: any) {
      toast.error(`Failed to join company: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md bg-bg rounded-card shadow-extruded p-8">
        <h1 className="text-2xl font-bold text-fg mb-6 text-center">Welcome to WoodShopPro</h1>
        <p className="text-muted mb-6 text-center">Complete your setup to get started</p>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-l-btn font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-accent text-white shadow-inset'
                : 'bg-bg text-muted shadow-extruded hover:shadow-extruded-hover'
            }`}
          >
            Create Company
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-r-btn font-medium transition-all ${
              activeTab === 'join'
                ? 'bg-accent text-white shadow-inset'
                : 'bg-bg text-muted shadow-extruded hover:shadow-extruded-hover'
            }`}
          >
            Join Company
          </button>
        </div>

        {activeTab === 'create' && (
          <form onSubmit={createForm.handleSubmit(onCreateCompany)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Company Name</label>
              <input
                {...createForm.register('companyName')}
                type="text"
                className="w-full px-4 py-3 bg-bg border border-muted rounded-btn shadow-inset focus:shadow-inset-focus focus:outline-none"
                placeholder="Enter your company name"
              />
              {createForm.formState.errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.companyName.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white font-medium rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all duration-300 py-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </button>
          </form>
        )}

        {activeTab === 'join' && (
          <form onSubmit={joinForm.handleSubmit(onJoinCompany)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Company Code</label>
              <input
                {...joinForm.register('companyCode')}
                type="text"
                className="w-full px-4 py-3 bg-bg border border-muted rounded-btn shadow-inset focus:shadow-inset-focus focus:outline-none"
                placeholder="Enter company code"
              />
              {joinForm.formState.errors.companyCode && (
                <p className="text-red-500 text-sm mt-1">{joinForm.formState.errors.companyCode.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white font-medium rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all duration-300 py-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join Company'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}