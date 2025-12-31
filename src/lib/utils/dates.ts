// Date utilities for ReviewRitual
import { 
  startOfWeek, 
  endOfWeek, 
  getISOWeek, 
  getYear, 
  format, 
  addWeeks, 
  subWeeks,
  differenceInDays,
  isWithinInterval,
  parseISO
} from 'date-fns';

/**
 * Get the start of the current week (Sunday)
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
}

/**
 * Get the end of the current week (Saturday)
 */
export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 0 });
}

/**
 * Get ISO week number and year
 */
export function getWeekInfo(date: Date = new Date()): { weekNumber: number; year: number; weekStart: string } {
  const weekStart = getWeekStart(date);
  return {
    weekNumber: getISOWeek(date),
    year: getYear(date),
    weekStart: format(weekStart, 'yyyy-MM-dd'),
  };
}

/**
 * Format week start date for display
 */
export function formatWeekDisplay(weekStart: string | Date): string {
  const date = typeof weekStart === 'string' ? parseISO(weekStart) : weekStart;
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(date, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Get past N weeks for heatmap display
 */
export function getPastWeeks(count: number = 12): Array<{ weekStart: string; weekNumber: number; year: number }> {
  const weeks: Array<{ weekStart: string; weekNumber: number; year: number }> = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    weeks.push(getWeekInfo(weekDate));
  }
  
  return weeks;
}

/**
 * Check if a date is within the current week
 */
export function isCurrentWeek(date: Date | string): boolean {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();
  return isWithinInterval(checkDate, { start: weekStart, end: weekEnd });
}

/**
 * Get days remaining in current week
 */
export function getDaysRemainingInWeek(): number {
  const today = new Date();
  const weekEnd = getWeekEnd();
  return differenceInDays(weekEnd, today);
}

/**
 * Format time elapsed in seconds to mm:ss
 */
export function formatTimeElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if streak is at risk (less than 24 hours until week ends)
 */
export function isStreakAtRisk(): boolean {
  const daysRemaining = getDaysRemainingInWeek();
  return daysRemaining <= 1;
}
