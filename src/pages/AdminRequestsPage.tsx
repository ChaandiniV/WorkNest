import { useEffect, useMemo, useState } from 'react';
import { loadMockDb } from '../services/mockDb';
import { fetchRequests, changeRequestStatus, assignRequest, resolveRequest } from '../services/requestService';
import { setLoading, setRequests, setSearch, setFilter } from '../features/requests/requestsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RequestTable } from '../components/tables/RequestTable';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export function AdminRequestsPage() {
  const dispatch = useAppDispatch();
  const { requests, loading, search, filters } = useAppSelector((state) => state.requests);
  const [selectedAgent, setSelectedAgent] = useState<Record<string, string>>({});
  const db = loadMockDb();
  const agents = db.users.filter((user) => user.role === 'agent');

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      const items = await fetchRequests();
      dispatch(setRequests(items));
    };
    load();
  }, [dispatch]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = search
        ? request.title.toLowerCase().includes(search.toLowerCase()) || request.description.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory = filters.category === 'All' || request.category === filters.category;
      const matchesPriority = filters.priority === 'All' || request.priority === filters.priority;
      const matchesStatus = filters.status === 'All' || request.status === filters.status;
      const matchesDepartment = filters.department === 'All' || request.department === filters.department;
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesDepartment;
    });
  }, [requests, search, filters]);

  const departments = Array.from(new Set(requests.map((item) => item.department)));
  const categories = Array.from(new Set(requests.map((item) => item.category)));
  const priorities = Array.from(new Set(requests.map((item) => item.priority)));
  const statuses = Array.from(new Set(requests.map((item) => item.status)));

  const handleAssignToAgent = async (requestId: string) => {
    const agentId = selectedAgent[requestId];
    if (!agentId) return;
    await assignRequest(requestId, agentId);
    const items = await fetchRequests();
    dispatch(setRequests(items));
  };

  const handleUpdateStatus = async (requestId: string, status: string) => {
    await changeRequestStatus(requestId, status as any, 'user-admin');
    const items = await fetchRequests();
    dispatch(setRequests(items));
  };

  const handleResolve = async (requestId: string) => {
    await resolveRequest(requestId, 'user-admin');
    const items = await fetchRequests();
    dispatch(setRequests(items));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Admin panel</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage service operations</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={search}
              onChange={(event) => dispatch(setSearch(event.target.value))}
              placeholder="Search requests"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.category}
              onChange={(event) => dispatch(setFilter({ key: 'category', value: event.target.value }))}
            >
              <option value="All">Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.status}
              onChange={(event) => dispatch(setFilter({ key: 'status', value: event.target.value }))}
            >
              <option value="All">Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.department}
              onChange={(event) => dispatch(setFilter({ key: 'department', value: event.target.value }))}
            >
              <option value="All">Department</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ticket summary</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Total requests <strong>{requests.length}</strong></p>
            <p>Agents available <strong>{agents.length}</strong></p>
            <p>High priority <strong>{requests.filter((item) => item.priority === 'High' || item.priority === 'Critical').length}</strong></p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : filteredRequests.length ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{request.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{request.department} • {request.category}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge label={request.priority} variant={request.priority} />
                  <Badge label={request.status} variant={request.status} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr]">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedAgent[request.id] ?? ''}
                      onChange={(event) => setSelectedAgent((prev) => ({ ...prev, [request.id]: event.target.value }))}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option value="">Assign agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                    <Button onClick={() => handleAssignToAgent(request.id)} disabled={!selectedAgent[request.id]}>Assign</Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button onClick={() => handleUpdateStatus(request.id, 'Assigned')} secondary>Assigned</Button>
                  <Button onClick={() => handleUpdateStatus(request.id, 'In Progress')} secondary>Progress</Button>
                  <Button onClick={() => handleUpdateStatus(request.id, 'Escalated')} secondary>Escalate</Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => handleResolve(request.id)} secondary>Resolve</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No requests match" description="Try removing filters or checking back later." action={<Button onClick={() => dispatch(setSearch(''))}>Reset search</Button>} />
      )}
    </div>
  );
}
