import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateRange(start: string, end: string): string {
  if (!start) return '';
  if (!end || start === end) return formatDate(start);

  try {
    const [sy, sm, sd] = start.split('-').map(Number);
    const [ey, em, ed] = end.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, sd);
    const endDate = new Date(ey, em - 1, ed);

    if (sy === ey) {
      if (sm === em) {
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate);
        return `${monthName} ${sd} - ${ed}, ${sy}`;
      }
      const smName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate);
      const emName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate);
      return `${smName} ${sd} - ${emName} ${ed}, ${sy}`;
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
  } catch {
    return `${start} - ${end}`;
  }
}

export function calculateDaysBetween(start: string, end: string): number {
  if (!start || !end) return 1;
  try {
    const [sy, sm, sd] = start.split('-').map(Number);
    const [ey, em, ed] = end.split('-').map(Number);
    const s = new Date(sy, sm - 1, sd).getTime();
    const e = new Date(ey, em - 1, ed).getTime();
    const diff = Math.max(0, e - s);
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return 1;
  }
}
