'use client';

import { Calendar, AlertTriangle } from 'lucide-react';

interface StreakDisplayProps {
  current: number;
  longest: number;
  total: number;
  avgTime?: number;
  nextReview?: string;
  isAtRisk?: boolean;
  hoursRemaining?: number;
}

export function StreakDisplay({ 
  current, 
  longest, 
  total, 
  avgTime = 42, 
  nextReview = 'Sunday, 5pm',
  isAtRisk = false,
  hoursRemaining = 0
}: StreakDisplayProps) {
  // Calculate completion rate (mock: assuming ~4 missed weeks)
  const completionRate = Math.round((total / (total + 4)) * 100);
  
  return (
    <div className="rounded-xl bg-coach-charcoal p-6">
      {/* Main Streak Number */}
      <div className="text-center mb-4">
        <p className={`font-display text-6xl font-bold ${isAtRisk ? 'text-warning-red' : 'text-streak-gold'}`}>
          {current}
        </p>
        <p className="font-display text-xs uppercase tracking-widest text-medium-gray">
          Week Current Streak
        </p>
      </div>
      
      {/* At Risk Warning */}
      {isAtRisk && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-warning-red/20 px-4 py-2">
          <AlertTriangle className="h-4 w-4 text-warning-red" />
          <p className="text-sm text-warning-red">
            <span className="font-bold">At risk!</span> {hoursRemaining} hours to complete your review
          </p>
        </div>
      )}
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 border-t border-coach-slate pt-4">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-success-green">{longest}</p>
          <p className="text-xs text-medium-gray uppercase tracking-wider">Best</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl font-bold text-white">{total}</p>
          <p className="text-xs text-medium-gray uppercase tracking-wider">Total</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl font-bold text-white">{completionRate}%</p>
          <p className="text-xs text-medium-gray uppercase tracking-wider">Rate</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl font-bold text-white">{avgTime}<span className="text-sm">m</span></p>
          <p className="text-xs text-medium-gray uppercase tracking-wider">Avg</p>
        </div>
      </div>
      
      {/* Next Review */}
      <div className="mt-4 pt-4 border-t border-coach-slate flex items-center justify-center gap-2 text-medium-gray">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">Next review: <span className="text-white font-medium">{nextReview}</span></span>
      </div>
    </div>
  );
}
