import { loadMockDb, mockDelay } from './mockDb';
import { ServiceRequest, RequestPriority } from '../types/request.types';
import { MonthlyVolume, CategoryMetric, DepartmentMetric, PriorityMetric, TrendMetric } from '../types/analytics.types';
import { differenceInHours, parseISO } from 'date-fns';

function buildCategoryCounts(requests: ServiceRequest[]): CategoryMetric[] {
  const counts: Record<string, number> = {};
  requests.forEach((item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

function buildDepartmentCounts(requests: ServiceRequest[]): DepartmentMetric[] {
  const counts: Record<string, number> = {};
  requests.forEach((item) => {
    counts[item.department] = (counts[item.department] ?? 0) + 1;
  });
  return Object.entries(counts).map(([department, count]) => ({ department, count }));
}

function buildPriorityMetrics(requests: ServiceRequest[]): PriorityMetric[] {
  const counts: Record<string, number> = {};
  requests.forEach((item) => {
    counts[item.priority] = (counts[item.priority] ?? 0) + 1;
  });
  return Object.entries(counts).map(([priority, count]) => ({ priority, count }));
}

export async function fetchRequestsByCategory(): Promise<CategoryMetric[]> {
  await mockDelay(250);
  const db = loadMockDb();
  return buildCategoryCounts(db.requests);
}

export async function fetchRequestsByDepartment(): Promise<DepartmentMetric[]> {
  await mockDelay(250);
  const db = loadMockDb();
  return buildDepartmentCounts(db.requests);
}

export async function fetchPriorityDistribution(): Promise<PriorityMetric[]> {
  await mockDelay(250);
  const db = loadMockDb();
  return buildPriorityMetrics(db.requests);
}

export async function fetchSlaBreachTrend(): Promise<TrendMetric[]> {
  await mockDelay(300);
  const db = loadMockDb();
  const trend: Record<string, number> = {};
  db.requests.forEach((request) => {
    if (request.status === 'Escalated' || request.status === 'Open') {
      const month = parseISO(request.createdAt).toLocaleString('default', { month: 'short' });
      trend[month] = (trend[month] ?? 0) + 1;
    }
  });
  return Object.entries(trend).map(([label, value]) => ({ label, value }));
}

export async function fetchAverageResolutionTime(): Promise<CategoryMetric[]> {
  await mockDelay(300);
  const db = loadMockDb();
  const totals: Record<string, { hours: number; count: number }> = {};
  db.requests.forEach((request) => {
    if (request.status === 'Resolved' || request.status === 'Closed') {
      const created = parseISO(request.createdAt);
      const resolved = parseISO(request.updatedAt);
      const hours = differenceInHours(resolved, created);
      totals[request.category] = totals[request.category] ?? { hours: 0, count: 0 };
      totals[request.category].hours += hours;
      totals[request.category].count += 1;
    }
  });
  return Object.entries(totals).map(([category, data]) => ({
    category,
    count: Math.round(data.hours / Math.max(data.count, 1))
  }));
}

export async function fetchMonthlyVolume(): Promise<MonthlyVolume[]> {
  await mockDelay(300);
  const db = loadMockDb();
  const volume: Record<string, number> = {};
  db.requests.forEach((request) => {
    const month = parseISO(request.createdAt).toLocaleString('default', { month: 'short' });
    volume[month] = (volume[month] ?? 0) + 1;
  });
  return Object.entries(volume).map(([month, count]) => ({ month, count }));
}

export function calculateDashboardKpis(requests: ServiceRequest[]) {
  const totals = requests.length;
  const assigned = requests.filter((item) => item.status === 'Assigned' || item.status === 'In Progress').length;
  const overdue = requests.filter((item) => new Date(item.slaDeadline) < new Date() && item.status !== 'Resolved' && item.status !== 'Closed').length;
  const highPriority = requests.filter((item) => item.priority === 'High' || item.priority === 'Critical').length;
  return { totals, assigned, overdue, highPriority };
}

export function calculateManagerMetrics(requests: ServiceRequest[]) {
  const breachRate = Math.round((requests.filter((item) => new Date(item.slaDeadline) < new Date() && item.status !== 'Resolved' && item.status !== 'Closed').length / Math.max(requests.length, 1)) * 100);
  const averageResolution = Math.round(
    requests
      .filter((item) => item.status === 'Resolved' || item.status === 'Closed')
      .reduce((sum, item) => sum + differenceInHours(parseISO(item.updatedAt), parseISO(item.createdAt)), 0) /
      Math.max(requests.filter((item) => item.status === 'Resolved' || item.status === 'Closed').length, 1)
  );
  const repeatedCategories = Object.entries(
    requests.reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] ?? 0) + 1 }), {} as Record<string, number>)
  )
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  return { breachRate, averageResolution, repeatedCategories };
}
