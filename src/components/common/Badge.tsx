import { classNames } from '../../utils/classNames';

const variantStyles: Record<string, string> = {
  Open: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200',
  Assigned: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
  'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  Escalated: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200',
  Closed: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200',
  Critical: 'bg-rose-100 text-rose-800 dark:bg-rose-200',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-200',
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200'
};

interface BadgeProps {
  label: string;
  variant?: string;
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={classNames('inline-flex rounded-full px-3 py-1 text-xs font-semibold', variantStyles[variant ?? label] ?? 'bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200')}>
      {label}
    </span>
  );
}
