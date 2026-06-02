import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { fetchRequestById, addRequestComment, changeRequestStatus, resolveRequest } from '../services/requestService';
import { formatDate } from '../utils/formatDate';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const result = await fetchRequestById(id);
      setRequest(result ?? null);
      setLoading(false);
    };
    load();
  }, [id]);

  const isAdmin = user?.role === 'admin';
  const slaStatus = useMemo(() => {
    if (!request) return null;
    const deadline = new Date(request.slaDeadline);
    const now = new Date();
    const remaining = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 3600000));
    return { deadline: formatDate(request.slaDeadline, 'PPpp'), remaining, breached: now > deadline };
  }, [request]);

  const handleStatus = async (status: string) => {
    if (!request || !user) return;
    await changeRequestStatus(request.id, status as any, user.id);
    const updated = await fetchRequestById(request.id);
    setRequest(updated);
    setMessage(`Status updated to ${status}`);
    setTimeout(() => setMessage(null), 2500);
  };

  const handleResolve = async () => {
    if (!request || !user) return;
    await resolveRequest(request.id, user.id);
    const updated = await fetchRequestById(request.id);
    setRequest(updated);
    setMessage('Request marked resolved.');
    setTimeout(() => setMessage(null), 2500);
  };

  const handleNote = async () => {
    if (!request || !user || !note.trim()) return;
    await addRequestComment(request.id, user.id, note, true);
    const updated = await fetchRequestById(request.id);
    setRequest(updated);
    setNote('');
    setMessage('Internal note added.');
    setTimeout(() => setMessage(null), 2500);
  };

  if (loading) {
    return <div className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800" />;
  }

  if (!request) {
    return <EmptyState title="Request not found" description="The ticket may have been removed." />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Request details</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{request.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={request.priority} variant={request.priority} />
            <Badge label={request.status} variant={request.status} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{request.department}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">SLA deadline</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{slaStatus?.deadline}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">Assigned to</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{request.assignedToId ?? 'Unassigned'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overview</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{request.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Created</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{formatDate(request.createdAt, 'PPP')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Updated</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{formatDate(request.updatedAt, 'PPP')}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">SLA window</p>
            <p className={`mt-2 text-sm font-medium ${slaStatus?.breached ? 'text-rose-500' : 'text-emerald-500'}`}>
              {slaStatus?.breached ? 'Breached' : `${slaStatus?.remaining}h remaining`}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Status actions</h3>
            <div className="mt-4 space-y-3">
              <Button onClick={() => handleStatus('Assigned')} disabled={!isAdmin}>Assign</Button>
              <Button onClick={() => handleStatus('In Progress')} secondary disabled={!isAdmin}>In progress</Button>
              <Button onClick={() => handleStatus('Escalated')} secondary disabled={!isAdmin}>Escalate</Button>
              <Button onClick={handleResolve} secondary disabled={!isAdmin}>Resolve</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Internal notes</h3>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Add a private note for support staff"
            />
            <Button onClick={handleNote} secondary disabled={!isAdmin || !note.trim()}>Save note</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Comments</h3>
          <div className="mt-4 space-y-4">
            {request.comments.length ? (
              request.comments.map((comment: any) => (
                <div key={comment.id} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{comment.authorId}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{comment.message}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDate(comment.createdAt, 'PPpp')} {comment.internal ? '• Internal' : ''}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No comments have been added yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Audit log</h3>
          <div className="mt-4 space-y-3">
            {request.auditLog.length ? (
              request.auditLog.map((entry: any) => (
                <div key={entry.id} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{entry.action}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDate(entry.timestamp, 'PPpp')} • {entry.actorId}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No history available for this request.</p>
            )}
          </div>
        </div>
      </div>
      {message ? <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-200">{message}</div> : null}
    </div>
  );
}
