'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface HeatmapCalendarProps {
  className?: string;
  onWeekClick?: (weekStart: string) => void;
}

type WeekStatus = 'complete' | 'missed' | 'future' | 'current';

// Generate past weeks
function getPastWeeks(count: number) {
  const weeks = [];
  const today = new Date();
  
  // Find the most recent Sunday
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - today.getDay());
  currentSunday.setHours(0, 0, 0, 0);
  
  for (let i = count - 1; i >= 0; i--) {
    const weekStart = new Date(currentSunday);
    weekStart.setDate(currentSunday.getDate() - (i * 7));
    
    weeks.push({
      weekStart: weekStart.toISOString().split('T')[0],
      weekNumber: getWeekNumber(weekStart),
      year: weekStart.getFullYear(),
    });
  }
  
  return weeks;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Mock completed weeks - will come from Supabase
const MOCK_COMPLETED_WEEKS = [
  -1, -2, -3, -4, -5, -6, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19
]; // Weeks ago that were completed (note: -7 is missing = missed week)

export function HeatmapCalendar({ 
  className,
  onWeekClick 
}: HeatmapCalendarProps) {
  const weeksToShow = 21; // 3 rows of 7
  const weeks = getPastWeeks(weeksToShow);
  const today = new Date();
  const currentWeekStart = weeks[weeks.length - 1]?.weekStart;
  
  // Create a set of completed week indices for quick lookup
  const completedWeekIndices = new Set(
    MOCK_COMPLETED_WEEKS.map(weeksAgo => weeksToShow - 1 + weeksAgo)
  );
  
  const getWeekStatus = (weekStart: string, index: number): WeekStatus => {
    const isCurrentWeek = weekStart === currentWeekStart;
    const isFuture = index > weeksToShow - 1;
    
    if (isFuture) return 'future';
    if (isCurrentWeek) return 'current';
    if (completedWeekIndices.has(index)) return 'complete';
    
    return 'missed';
  };
  
  const statusColors: Record<WeekStatus, string> = {
    complete: 'bg-success-green hover:bg-success-green/80',
    missed: 'bg-warning-red hover:bg-warning-red/80',
    future: 'bg-warm-gray/40',
    current: 'bg-focus-orange hover:bg-focus-orange/80',
  };
  
  return (
    <div className={cn('', className)}>
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, index) => {
          const status = getWeekStatus(week.weekStart, index);
          const isClickable = status === 'complete' || status === 'current';
          
          return (
            <button
              key={week.weekStart}
              onClick={() => isClickable && onWeekClick?.(week.weekStart)}
              disabled={!isClickable}
              className={cn(
                'aspect-square rounded transition-colors',
                statusColors[status],
                isClickable && 'cursor-pointer',
                !isClickable && 'cursor-default'
              )}
              title={`Week ${week.weekNumber}, ${week.year}`}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-success-green" />
          <span className="text-text-secondary">Complete</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-warning-red" />
          <span className="text-text-secondary">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-focus-orange" />
          <span className="text-text-secondary">Current</span>
        </div>
      </div>
    </div>
  );
}
