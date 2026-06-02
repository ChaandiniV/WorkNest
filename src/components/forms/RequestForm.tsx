import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';

const categories = [
  'IT Support',
  'HR Support',
  'Facilities',
  'Travel',
  'Office Access',
  'Equipment',
  'Onboarding',
  'Pantry / Supplies'
] as const;

const priorities = ['Low', 'Medium', 'High', 'Critical'] as const;

const requestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  category: z.enum(categories),
  priority: z.enum(priorities),
  department: z.string().min(2, 'Department is required.'),
  description: z.string().min(10, 'Description is required.')
});

export type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormProps {
  defaultValues?: Partial<RequestFormValues>;
  onSubmit: (values: RequestFormValues) => void;
}

export function RequestForm({ defaultValues, onSubmit }: RequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      category: 'IT Support',
      priority: 'Medium',
      department: '',
      description: '',
      ...defaultValues
    }
  });

  useEffect(() => {
    window.dispatchEvent(new Event('form:mounted'));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900/95">
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
          <input {...register('title')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          {errors.title ? <p className="text-xs text-rose-500">{errors.title.message}</p> : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Category
          <select {...register('category')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            {categories.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Priority
          <select {...register('priority')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            {priorities.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Department
          <input {...register('department')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          {errors.department ? <p className="text-xs text-rose-500">{errors.department.message}</p> : null}
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        Description
        <textarea rows={5} {...register('description')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        {errors.description ? <p className="text-xs text-rose-500">{errors.description.message}</p> : null}
      </label>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>Submit request</Button>
      </div>
    </form>
  );
}
