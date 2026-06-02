import { format, parseISO } from 'date-fns';

export function formatDate(value: string, pattern = 'MMM d, yyyy h:mm a'): string {
  try {
    return format(parseISO(value), pattern);
  } catch {
    return value;
  }
}
