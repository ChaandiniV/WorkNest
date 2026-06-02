import { describe, expect, it } from 'vitest';
import { getSlaDeadline, getSlaStatus } from '../utils/calculateSLA';

describe('SLA calculation', () => {
  it('calculates critical SLA deadlines correctly', () => {
    const createdAt = '2026-06-02T08:00:00.000Z';
    const deadline = getSlaDeadline(createdAt, 'Critical');
    expect(new Date(deadline).toISOString()).toBe('2026-06-02T12:00:00.000Z');
  });

  it('returns breached when time is past deadline', () => {
    const createdAt = '2026-06-01T00:00:00.000Z';
    const status = getSlaStatus(createdAt, 'Low', new Date('2026-06-04T00:00:00.000Z'));
    expect(status.breached).toBe(true);
    expect(status.hoursRemaining).toBeLessThan(0);
  });
});
