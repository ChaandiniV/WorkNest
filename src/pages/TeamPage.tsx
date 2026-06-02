import { useEffect, useMemo, useState } from 'react';
import { loadMockDb } from '../services/mockDb';
import { fetchRequests } from '../services/requestService';
import { User } from '../types/user.types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function TeamPage() {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsCount, setRequestsCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const db = loadMockDb();
      const assigned = await fetchRequests();
      const counts: Record<string, number> = {};
      assigned.forEach((request) => {
        if (request.assignedToId) {
          counts[request.assignedToId] = (counts[request.assignedToId] ?? 0) + 1;
        }
      });
      setAgents(db.users.filter((user) => user.role === 'agent'));
      setRequestsCount(counts);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Team workload</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Support agents and ticket load</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 rounded-3xl bg-slate-100 dark:bg-slate-800" />
          ))
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{agent.department}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">{requestsCount[agent.id] ?? 0} open</div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Assigned tickets reflect current workload for each support agent.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge label="Support agent" />
                <Badge label={agent.role} />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm text-slate-500 dark:text-slate-400">Team readiness</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button secondary>Review agent roster</Button>
          <Button>Schedule support shift</Button>
        </div>
      </div>
    </div>
  );
}
