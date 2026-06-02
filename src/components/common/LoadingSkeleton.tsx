interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = 'h-6 w-full rounded-xl bg-slate-200/70 dark:bg-slate-700/70' }: LoadingSkeletonProps) {
  return <div className={className} />;
}
