import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearUser } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/settings/settingsSlice';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useAppSelector((state) => state.settings.theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:px-8">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name ?? 'Guest'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
