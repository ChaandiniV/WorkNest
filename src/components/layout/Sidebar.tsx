import { ClipboardList, Home, Settings, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

export function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role ?? 'employee';

  const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, show: true },
    { to: '/requests', label: 'Requests', icon: ClipboardList, show: true },
    { to: '/requests/new', label: 'New Request', icon: Sparkles, show: true },
    { to: '/admin/requests', label: 'Admin Requests', icon: ShieldCheck, show: role === 'admin' },
    { to: '/admin/analytics', label: 'Analytics', icon: Zap, show: role === 'admin' },
    { to: '/admin/team', label: 'Team', icon: Users, show: role === 'admin' },
    { to: '/manager/overview', label: 'Manager Overview', icon: ShieldCheck, show: role === 'manager' },
    { to: '/dev-console', label: 'Dev Console', icon: Sparkles, show: true },
    { to: '/settings', label: 'Settings', icon: Settings, show: true }
  ];

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-slate-200 bg-slate-950/95 px-6 py-8 text-slate-200 shadow-soft dark:border-slate-800 lg:flex">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-3 text-2xl font-semibold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/95">W</span>
          WorkNest
        </div>
        <p className="max-w-xs text-sm text-slate-300">Corporate service portal for employees, managers, and admins.</p>
      </div>
      <nav className="space-y-2">
        {nav.filter((item) => item.show).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">Signed in as</p>
        <p>{user?.name ?? 'Guest'}</p>
        <p className="text-xs text-slate-500">{role.toUpperCase()}</p>
      </div>
    </aside>
  );
}
