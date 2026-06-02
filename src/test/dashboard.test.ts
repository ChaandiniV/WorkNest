import { describe, expect, it } from 'vitest';
import { calculateDashboardKpis } from '../services/analyticsService';

const sampleRequests = [
  { id: '1', status: 'Assigned', priority: 'High', slaDeadline: '2026-06-03T00:00:00.000Z' },
  { id: '2', status: 'Open', priority: 'Critical', slaDeadline: '2026-05-30T00:00:00.000Z' },
  { id: '3', status: 'Resolved', priority: 'Low', slaDeadline: '2026-06-05T00:00:00.000Z' }
] as any;

describe('Dashboard metrics', () => {
  it('correctly calculates counts for admin KPIs', () => {
    const metrics = calculateDashboardKpis(sampleRequests);
    expect(metrics.totals).toBe(3);
    expect(metrics.assigned).toBe(1);
    expect(metrics.highPriority).toBe(2);
  });
});
