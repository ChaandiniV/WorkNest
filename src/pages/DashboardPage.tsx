import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchRequests } from '../services/requestService';
import { calculateDashboardKpis, calculateManagerMetrics } from '../services/analyticsService';
import { setRequests, setLoading } from '../features/requests/requestsSlice';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const requests = useAppSelector((state) => state.requests.requests);
  const loading = useAppSelector((state) => state.requests.loading);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      const items = await fetchRequests();
      dispatch(setRequests(items));
    };
    load();
  }, [dispatch]);

  const userRequests = useMemo(
    () => requests.filter((request) => request.requesterId === user?.id),
    [requests, user]
  );

  const slaAlerts = useMemo(
    () => requests.filter((item) => new Date(item.slaDeadline) < new Date() && item.status !== 'Resolved' && item.status !== 'Closed'),
    [requests]
  );

  const adminMetrics = useMemo(() => calculateDashboardKpis(requests), [requests]);
  const managerMetrics = useMemo(() => calculateManagerMetrics(requests), [requests]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome back, {user.name}</h2>
          </div>
          <Button onClick={() => navigate('/requests')}>Browse requests</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
          ))}
        </div>
      ) : null}

      {user.role === 'employee' ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">My requests</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{userRequests.length}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Open and active tickets from your account.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">Resolved</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{userRequests.filter((item) => item.status === 'Resolved').length}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Tickets successfully closed.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">SLA risk</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{slaAlerts.length}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Requests approaching or past deadline.</p>
          </div>
        </div>
      ) : null}

      {user.role === 'admin' ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            { label: 'Total requests', value: adminMetrics.totals },
            { label: 'Assigned tickets', value: adminMetrics.assigned },
            { label: 'Overdue tickets', value: adminMetrics.overdue },
            { label: 'High priority', value: adminMetrics.highPriority }
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</h3>
            </div>
          ))}
        </div>
      ) : null}

      {user.role === 'manager' ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">SLA breach rate</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{managerMetrics.breachRate}%</h3>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg resolution</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{managerMetrics.averageResolution}h</h3>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <p className="text-sm text-slate-500 dark:text-slate-400">Top issue categories</p>
            {managerMetrics.repeatedCategories.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {managerMetrics.repeatedCategories.map((category) => (
                  <li key={category}>• {category}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No repeating issues yet.</p>
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent activity</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.slice(0, 3).map((request) => (
            <article key={request.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">{request.category}</p>
                <Badge label={request.status} variant={request.status} />
              </div>
              <h4 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{request.title}</h4>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Updated {formatDate(request.updatedAt, 'MMM d')}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
