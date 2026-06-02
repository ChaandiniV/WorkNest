import { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  secondary?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({ children, type = 'button', onClick, secondary, fullWidth, disabled }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2',
        secondary
          ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-400',
        disabled ? 'cursor-not-allowed opacity-60' : 'shadow-soft',
        fullWidth && 'w-full'
      )}
    >
      {children}
    </button>
  );
}
