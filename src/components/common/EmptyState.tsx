import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/70">
      <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Nothing found</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
