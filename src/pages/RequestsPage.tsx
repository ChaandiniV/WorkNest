import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchRequests } from '../services/requestService';
import { setLoading, setRequests, setSearch, setFilter } from '../features/requests/requestsSlice';
import { RequestTable } from '../components/tables/RequestTable';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export function RequestsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requests, loading, search, filters } = useAppSelector((state) => state.requests);

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

  const categories = Array.from(new Set(requests.map((item) => item.category)));
  const priorities = Array.from(new Set(requests.map((item) => item.priority)));
  const statuses = Array.from(new Set(requests.map((item) => item.status)));
  const departments = Array.from(new Set(requests.map((item) => item.department)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Requests</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Support ticket queue</h2>
        </div>
        <Button onClick={() => navigate('/requests/new')}>Create new request</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex-1">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Search</span>
              <input
                value={search}
                onChange={(event) => dispatch(setSearch(event.target.value))}
                placeholder="Search requests"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.category}
              onChange={(event) => dispatch(setFilter({ key: 'category', value: event.target.value }))}
            >
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.priority}
              onChange={(event) => dispatch(setFilter({ key: 'priority', value: event.target.value }))}
            >
              <option value="All">All priorities</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.status}
              onChange={(event) => dispatch(setFilter({ key: 'status', value: event.target.value }))}
            >
              <option value="All">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={filters.department}
              onChange={(event) => dispatch(setFilter({ key: 'department', value: event.target.value }))}
            >
              <option value="All">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Summary</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Total requests: <strong>{requests.length}</strong></p>
            <p>Filtered: <strong>{filteredRequests.length}</strong></p>
            <p>Current status: <strong>{filters.status}</strong></p>
            <p>Current category: <strong>{filters.category}</strong></p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : filteredRequests.length ? (
        <RequestTable requests={filteredRequests} />
      ) : (
        <EmptyState title="No matching requests" description="Adjust your search or filters to find service requests." action={<Button onClick={() => dispatch(setSearch(''))}>Clear filters</Button>} />
      )}
    </div>
  );
}
