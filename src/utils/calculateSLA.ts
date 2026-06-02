import { addHours, differenceInHours, formatISO } from 'date-fns';
import { RequestPriority } from '../types/request.types';

const deadlines: Record<RequestPriority, number> = {
  Critical: 4,
  High: 12,
  Medium: 24,
  Low: 48
};

export function getSlaDeadline(createdAt: string, priority: RequestPriority): string {
  const created = new Date(createdAt);
  return formatISO(addHours(created, deadlines[priority]));
}

export function getSlaStatus(createdAt: string, priority: RequestPriority, reference = new Date()): {
  deadline: string;
  hoursRemaining: number;
  breached: boolean;
} {
  const deadline = new Date(getSlaDeadline(createdAt, priority));
  const hoursRemaining = differenceInHours(deadline, reference);
  return {
    deadline: deadline.toISOString(),
    hoursRemaining,
    breached: reference > deadline
  };
}
