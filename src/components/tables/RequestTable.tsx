import { Link } from 'react-router-dom';
import { ServiceRequest } from '../../types/request.types';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

interface RequestTableProps {
  requests: ServiceRequest[];
}

export function RequestTable({ requests }: RequestTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th className="px-5 py-4 font-medium">Title</th>
            <th className="px-5 py-4 font-medium">Category</th>
            <th className="px-5 py-4 font-medium">Priority</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Department</th>
            <th className="px-5 py-4 font-medium">Updated</th>
            <th className="px-5 py-4 font-medium">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{request.title}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{request.category}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300"><Badge label={request.priority} variant={request.priority} /></td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300"><Badge label={request.status} variant={request.status} /></td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{request.department}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(request.updatedAt, 'MMM d')}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                <Link className="text-indigo-600 hover:text-indigo-800 dark:text-cyan-300 dark:hover:text-cyan-100" to={`/requests/${request.id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
