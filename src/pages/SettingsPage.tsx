import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setNotifications, updateProfile, toggleTheme } from '../features/settings/settingsSlice';
import { Button } from '../components/common/Button';

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const [name, setName] = useState(settings.profile.name);
  const [email, setEmail] = useState(settings.profile.email);
  const [department, setDepartment] = useState(settings.profile.department);

  const handleSave = () => {
    dispatch(updateProfile({ name, email, department }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">User preferences</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Theme</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Toggle between light and dark mode for the interface.</p>
          <div className="mt-5 flex items-center gap-4">
            <Button onClick={() => dispatch(toggleTheme())} secondary>{settings.theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</Button>
            <span className="text-sm text-slate-500 dark:text-slate-400">Current: {settings.theme}</span>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Mock notification preferences for the portal.</p>
          <div className="mt-5 flex items-center gap-4">
            <label className="inline-flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={settings.notifications} onChange={(event) => dispatch(setNotifications(event.target.checked))} className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Receive notifications
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Department
            <input value={department} onChange={(event) => setDepartment(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save profile</Button>
        </div>
      </div>
    </div>
  );
}
