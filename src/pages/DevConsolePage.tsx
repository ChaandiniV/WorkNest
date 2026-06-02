import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { getLocalStorageStatus, loadMockDb } from '../services/mockDb';
import { Badge } from '../components/common/Badge';

export function DevConsolePage() {
  const auth = useAppSelector((state) => state.auth);
  const requests = useAppSelector((state) => state.requests);
  const devConsole = useAppSelector((state) => state.devConsole);
  const settings = useAppSelector((state) => state.settings);
  const storageStatus = getLocalStorageStatus();
  const db = loadMockDb();

  const appStateSummary = useMemo(
    () => ({
      user: auth.user?.name ?? 'anonymous',
      role: auth.user?.role ?? 'none',
      requests: requests.requests.length,
      theme: settings.theme,
      notifications: settings.notifications,
      featureFlags: devConsole.featureFlags
    }),
    [auth.user, devConsole.featureFlags, requests.requests.length, settings.notifications, settings.theme]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Developer console</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Frontend observability</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Current user</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Name: {auth.user?.name ?? 'Guest'}</p>
            <p>Role: {auth.user?.role ?? 'none'}</p>
            <p>Email: {auth.user?.email ?? 'n/a'}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">App state</h3>
          <pre className="mt-4 max-h-60 overflow-auto rounded-3xl bg-slate-50 p-4 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {JSON.stringify(appStateSummary, null, 2)}
          </pre>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Mock status</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>LocalStorage present: {storageStatus.exists ? 'Yes' : 'No'}</p>
            <p>Database size: {storageStatus.size} bytes</p>
            <p>Request count: {db.requests.length}</p>
            <p>Feature flags: {Object.keys(devConsole.featureFlags).join(', ')}</p>
            <p>App version: 0.1.0</p>
            <p>Mode: {import.meta.env.MODE}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent UI actions</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {devConsole.logs.length ? (
              devConsole.logs.map((log) => (
                <li key={log.id} className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-950/80">
                  <div className="flex items-center justify-between gap-3">
                    <span>{log.category}</span>
                    <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1">{log.message}</p>
                </li>
              ))
            ) : (
              <p>No UI actions recorded yet.</p>
            )}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Errors & validation</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Failed API calls: {devConsole.failedCalls}</p>
            <p>API latency: {devConsole.apiLatency}ms</p>
            <p>Validation issues: {devConsole.validationErrors.length}</p>
            <div className="space-y-2">
              {devConsole.validationErrors.map((err, index) => (
                <Badge key={index} label={err} variant="Critical" />
              ))}
            </div>
            <div className="space-y-2">
              {devConsole.errors.slice(0, 3).map((error, index) => (
                <p key={index} className="rounded-3xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
