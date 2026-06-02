import { useEffect, useMemo, useState } from 'react';
import { fetchRequests } from '../services/requestService';
import { calculateManagerMetrics } from '../services/analyticsService';
import { exportCSV } from '../utils/exportCSV';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function ManagerOverviewPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const metrics = useMemo(() => calculateManagerMetrics(requests), [requests]);

  useEffect(() => {
    const load = async () => {
      const results = await fetchRequests();
      setRequests(results);
      setLoading(false);
    };
    load();
  }, []);

  const exportReport = () => {
    const rows = requests.map((item) => ({
      id: item.id,
      title: item.title,
      department: item.department,
      status: item.status,
      priority: item.priority,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    exportCSV(rows, 'manager-overview.csv');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Manager overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Department service performance</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm text-slate-500 dark:text-slate-400">SLA breach rate</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{metrics.breachRate}%</h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg resolution time</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{metrics.averageResolution}h</h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm text-slate-500 dark:text-slate-400">Repeated issue categories</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {metrics.repeatedCategories.length ? metrics.repeatedCategories.map((category) => <div key={category}>• {category}</div>) : <div>No repeating categories yet.</div>}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Operational risk overview</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Monitor department trends, SLA risk, and escalation signals.</p>
          </div>
          <Button onClick={exportReport}>Export CSV</Button>
        </div>
        {loading ? (
          <div className="mt-6 rounded-3xl bg-slate-100 p-6 text-slate-500 dark:bg-slate-800 dark:text-slate-300">Loading request data…</div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.slice(0, 6).map((request) => (
              <div key={request.id} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{request.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.department}</p>
                <Badge label={request.status} variant={request.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
