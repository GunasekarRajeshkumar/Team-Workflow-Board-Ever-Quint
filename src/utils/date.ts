import { formatDistanceToNow } from 'date-fns';

/**
 * Formats a date as a relative time string (e.g., "3 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'unknown time';
  }
}

