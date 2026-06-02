import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DepartmentMetric } from '../../types/analytics.types';

const colors = ['#60a5fa', '#7c3aed', '#38bdf8', '#2dd4bf', '#f97316', '#f43f5e'];

interface DepartmentChartProps {
  data: DepartmentMetric[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Requests by Department</h3>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="department" outerRadius={100} fill="#6366f1" stroke="none">
              {data.map((entry, index) => (
                <Cell key={entry.department} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
