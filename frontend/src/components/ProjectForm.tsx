import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProject } from '../hooks/useProjects';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Project name required'),
  client: z.string().min(1, 'Client name required'),
  startDate: z.string().min(1, 'Start date required'),
});

type FormData = z.infer<typeof schema>;

export default function ProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { createProject } = useCreateProject();

  const onSubmit = async (data: FormData) => {
    try {
      await createProject({ ...data, startDate: new Date(data.startDate) });
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-bg rounded-card shadow-extruded p-6">
      <h2 className="text-2xl font-bold text-fg mb-4">Create New Project</h2>
      <div>
        <label className="block text-muted mb-2">Project Name</label>
        <input
          type="text"
          {...register('name')}
          className="w-full bg-bg rounded-btn shadow-inset-deep focus:shadow-inset-deep focus:ring-2 focus:ring-accent/50 transition-all duration-300 p-4 text-fg"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-muted mb-2">Client Name</label>
        <input
          type="text"
          {...register('client')}
          className="w-full bg-bg rounded-btn shadow-inset-deep focus:shadow-inset-deep focus:ring-2 focus:ring-accent/50 transition-all duration-300 p-4 text-fg"
        />
        {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>}
      </div>
      <div>
        <label className="block text-muted mb-2">Start Date</label>
        <input
          type="date"
          {...register('startDate')}
          className="w-full bg-bg rounded-btn shadow-inset-deep focus:shadow-inset-deep focus:ring-2 focus:ring-accent/50 transition-all duration-300 p-4 text-fg"
        />
        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
      </div>
      <button type="submit" className="w-full bg-accent text-white px-4 py-3 rounded-btn shadow-extruded hover:shadow-extruded-hover hover:-translate-y-1 active:shadow-inset active:translate-y-0.5 transition-all duration-300 font-semibold">
        Create Project
      </button>
    </form>
  );
}