'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Settings, History, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar';

// Mock data - will come from Supabase
const MOCK_STREAK = {
  current: 12,
  longest: 16,
  total: 47,
  avgTime: 42,
  nextReview: 'Sunday, 5pm',
};

// Mock: Is review complete for this week?
const REVIEW_STATUS = 'not_started' as 'not_started' | 'in_progress' | 'complete';
const REVIEW_PROGRESS = 0; // 0-5 steps complete

// Mock: Hours until week ends (for streak warning)
const HOURS_UNTIL_WEEK_ENDS = 18;

// Mock: Map week starts to review IDs (will come from Supabase)
const MOCK_WEEK_TO_REVIEW: Record<string, string> = {
  // These would be actual review IDs from the database
};

export default function DashboardPage() {
  const router = useRouter();
  const isStreakAtRisk = REVIEW_STATUS !== 'complete' && HOURS_UNTIL_WEEK_ENDS < 24;
  
  const getCtaText = () => {
    switch (REVIEW_STATUS) {
      case 'complete':
        return 'Review Complete ✓';
      case 'in_progress':
        return `Continue Review (${REVIEW_PROGRESS}/5)`;
      default:
        return "Start This Week's Review";
    }
  };
  
  const getCtaHref = () => {
    switch (REVIEW_STATUS) {
      case 'complete':
        return '/history';
      case 'in_progress':
        return `/review/${REVIEW_PROGRESS + 1}-${['clear', 'commit', 'ahead', 'protect', 'reflect'][REVIEW_PROGRESS]}`;
      default:
        return '/review/1-clear';
    }
  };
  
  const handleWeekClick = (weekStart: string) => {
    // For now, navigate to history with the week as a query param
    // Once Supabase is connected, we'll look up the actual review ID
    const reviewId = MOCK_WEEK_TO_REVIEW[weekStart];
    if (reviewId) {
      router.push(`/history/${reviewId}`);
    } else {
      // Fallback: go to history page filtered to that week
      router.push(`/history?week=${weekStart}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-coach-charcoal">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 -rotate-3 items-center justify-center rounded-lg bg-focus-orange font-display text-sm font-bold text-white">
              RR
            </div>
            <span className="font-display text-lg font-bold text-white">
              Review<span className="text-focus-orange">Ritual</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/insights" className="text-medium-gray hover:text-white transition-colors" title="Insights">
              <TrendingUp className="h-5 w-5" />
            </Link>
            <Link href="/history" className="text-medium-gray hover:text-white transition-colors" title="History">
              <History className="h-5 w-5" />
            </Link>
            <Link href="/settings" className="text-medium-gray hover:text-white transition-colors" title="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Streak Display - Single Pane of Glass */}
        <div className="mb-6">
          <StreakDisplay
            current={MOCK_STREAK.current}
            longest={MOCK_STREAK.longest}
            total={MOCK_STREAK.total}
            avgTime={MOCK_STREAK.avgTime}
            nextReview={MOCK_STREAK.nextReview}
            isAtRisk={isStreakAtRisk}
            hoursRemaining={HOURS_UNTIL_WEEK_ENDS}
          />
        </div>
        
        {/* Primary CTA */}
        <div className="mb-8">
          <Link href={getCtaHref()}>
            <Button
              size="lg"
              className="w-full"
              variant={REVIEW_STATUS === 'complete' ? 'success' : 'primary'}
              disabled={REVIEW_STATUS === 'complete'}
            >
              {getCtaText()}
            </Button>
          </Link>
          {REVIEW_STATUS !== 'complete' && (
            <p className="mt-2 text-center text-sm text-text-secondary">
              <Clock className="mr-1 inline h-4 w-4" />
              ~45 minutes to complete
            </p>
          )}
        </div>
        
        {/* Heatmap Calendar */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Review History
            </h2>
            <Link href="/history" className="text-xs text-focus-orange hover:underline">
              View all →
            </Link>
          </div>
          <HeatmapCalendar onWeekClick={handleWeekClick} />
        </div>

      </main>
    </div>
  );
}
