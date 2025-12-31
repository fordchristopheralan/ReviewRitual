'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, Users, Target, Lightbulb, Heart, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

type TimeFrame = 'monthly' | 'quarterly' | 'yearly';

// Mock data - will come from Supabase aggregations
const MOCK_DATA = {
  monthly: {
    period: 'December 2024',
    reviewsCompleted: 4,
    reviewsTotal: 4,
    avgDuration: 42,
    bigThreeCompleted: 10,
    bigThreeTotal: 12,
    teamSupport: [
      { person: 'Sarah (Senior Dev)', count: 4, highlights: ['Promotion packet reviewed', 'Project handoff complete'] },
      { person: 'Mike (New Hire)', count: 4, highlights: ['Onboarding complete', 'First solo project assigned'] },
      { person: 'Leadership', count: 3, highlights: ['Q1 headcount approved'] },
    ],
    familySupport: [
      { person: 'Wife', count: 3, highlights: ['Date night scheduled', 'Holiday planning done'] },
      { person: 'Kids', count: 4, highlights: ['School event attended', 'Weekend activities planned'] },
    ],
    deliverables: [
      { name: 'Q4 Planning Doc', status: 'completed' },
      { name: 'Budget Reconciliation', status: 'completed' },
      { name: 'Team Roadmap', status: 'completed' },
      { name: 'Performance Reviews', status: 'in_progress' },
    ],
    sideProjectHighlights: [
      'Shipped chat quiz prototype',
      'Pricing page designed',
      'Stripe integration started',
    ],
    topWins: [
      'Morning deep work blocks transformed productivity',
      'Said no to 3 meetings that could be emails',
      'Team morale improved after skip-level conversations',
    ],
    topChallenges: [
      'Context switching on Tuesdays',
      'Skipped lunch too often',
      'Email batching needs refinement',
    ],
    oneChanges: [
      'Block 2 hours for deep work every morning',
      'Take a real lunch break away from desk',
      'Prep 1:1 agendas the night before',
      'Decline meetings without agendas',
    ],
  },
  quarterly: {
    period: 'Q4 2024',
    reviewsCompleted: 11,
    reviewsTotal: 13,
    avgDuration: 44,
    bigThreeCompleted: 28,
    bigThreeTotal: 33,
    teamSupport: [
      { person: 'Sarah (Senior Dev)', count: 12, highlights: ['Promoted to Tech Lead', 'Led architecture redesign'] },
      { person: 'Mike (New Hire)', count: 10, highlights: ['Completed onboarding', 'Shipped 3 features independently'] },
      { person: 'Leadership', count: 8, highlights: ['Q1 budget approved', 'Headcount increase secured'] },
    ],
    familySupport: [
      { person: 'Wife', count: 10, highlights: ['Anniversary trip planned', 'Weekly date nights maintained'] },
      { person: 'Kids', count: 11, highlights: ['Soccer season supported', 'Holiday traditions kept'] },
    ],
    deliverables: [
      { name: 'Q4 OKRs', status: 'completed' },
      { name: 'Team Restructure', status: 'completed' },
      { name: 'Budget Planning', status: 'completed' },
      { name: 'Hiring Pipeline', status: 'completed' },
      { name: '2025 Roadmap', status: 'in_progress' },
    ],
    sideProjectHighlights: [
      'ValleySomm MVP launched',
      'First 5 paying customers',
      'Brand identity finalized',
      'Winery database complete',
    ],
    topWins: [
      'Established consistent deep work routine',
      'Team velocity increased 30%',
      'Zero missed 1:1s with direct reports',
    ],
    topChallenges: [
      'Work-life balance during crunch',
      'Meeting overload in November',
      'Side project competing with rest',
    ],
    oneChanges: [
      'Morning routines are non-negotiable',
      'Batch similar meetings on same days',
      'Protect weekends for family',
    ],
  },
  yearly: {
    period: '2024',
    reviewsCompleted: 47,
    reviewsTotal: 52,
    avgDuration: 43,
    bigThreeCompleted: 118,
    bigThreeTotal: 141,
    teamSupport: [
      { person: 'Sarah (Senior Dev)', count: 48, highlights: ['Promoted twice', 'Now leading own team'] },
      { person: 'Mike (New Hire)', count: 35, highlights: ['Grew from junior to mid-level', 'Mentoring new hires'] },
      { person: 'Leadership', count: 40, highlights: ['Secured 40% budget increase', 'Launched 2 major initiatives'] },
    ],
    familySupport: [
      { person: 'Wife', count: 42, highlights: ['Maintained weekly date nights', 'Two vacations taken'] },
      { person: 'Kids', count: 45, highlights: ['Never missed important events', 'Started new traditions'] },
    ],
    deliverables: [
      { name: 'Major launches', status: 'completed', count: 4 },
      { name: 'Team hires', status: 'completed', count: 3 },
      { name: 'Process improvements', status: 'completed', count: 12 },
    ],
    sideProjectHighlights: [
      'ValleySomm: Idea → Launched MVP',
      'ReviewRitual: Built for personal use',
      'Generated first side project revenue',
    ],
    topWins: [
      'Best year for team growth and retention',
      'Consistent weekly review habit established',
      'Work-life integration dramatically improved',
    ],
    topChallenges: [
      'Q2 burnout period',
      'Saying no to good opportunities',
      'Maintaining energy for side projects',
    ],
    oneChanges: [
      'Weekly reviews are now automatic',
      'Deep work is protected time',
      'Family time is scheduled like meetings',
    ],
  },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function InsightsPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [periodIndex, setPeriodIndex] = useState(0); // 0 = current, 1 = previous, etc.
  
  const data = MOCK_DATA[timeFrame];
  
  const completionRate = Math.round((data.reviewsCompleted / data.reviewsTotal) * 100);
  const bigThreeRate = Math.round((data.bigThreeCompleted / data.bigThreeTotal) * 100);
  
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-coach-charcoal">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 -rotate-3 items-center justify-center rounded-lg bg-focus-orange font-display text-sm font-bold text-white">
              RR
            </div>
            <span className="font-display text-lg font-bold text-white">
              Review<span className="text-focus-orange">Ritual</span>
            </span>
          </Link>
        </div>
      </header>
      
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-focus-orange hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-coach-charcoal">Insights</h1>
          <p className="text-text-secondary">See patterns and progress over time.</p>
        </div>
        
        {/* Time Frame Selector */}
        <div className="mb-6 flex gap-2">
          {(['monthly', 'quarterly', 'yearly'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeFrame === tf
                  ? 'bg-focus-orange text-white'
                  : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Period Navigator */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-coach-charcoal p-4">
          <button className="text-medium-gray hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="font-display text-lg font-bold text-white">{data.period}</p>
            <p className="text-xs text-medium-gray">
              {data.reviewsCompleted} of {data.reviewsTotal} reviews completed
            </p>
          </div>
          <button className="text-medium-gray hover:text-white">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Overview Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-success-green">{completionRate}%</p>
            <p className="text-xs text-text-secondary">Review Rate</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-streak-gold">{bigThreeRate}%</p>
            <p className="text-xs text-text-secondary">Big 3 Hit Rate</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-coach-charcoal">{data.avgDuration}</p>
            <p className="text-xs text-text-secondary">Avg Minutes</p>
          </div>
        </div>
        
        {/* Team Support Summary */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-success-green" />
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Team Support
            </h2>
          </div>
          <div className="card space-y-4">
            {data.teamSupport.map((person, idx) => (
              <div key={idx} className="border-b border-warm-gray pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-coach-charcoal">{person.person}</p>
                  <span className="text-xs text-medium-gray">{person.count} weeks</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {person.highlights.map((h, i) => (
                    <span key={i} className="rounded-full bg-success-green/10 px-2 py-0.5 text-xs text-success-green">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Family Support Summary */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-rest-blue" />
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Family Support
            </h2>
          </div>
          <div className="card border-rest-blue/30 bg-rest-blue/5 space-y-4">
            {data.familySupport.map((person, idx) => (
              <div key={idx} className="border-b border-rest-blue/20 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-coach-charcoal">{person.person}</p>
                  <span className="text-xs text-medium-gray">{person.count} weeks</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {person.highlights.map((h, i) => (
                    <span key={i} className="rounded-full bg-rest-blue/10 px-2 py-0.5 text-xs text-rest-blue">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Deliverables */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5 text-focus-orange" />
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Deliverables
            </h2>
          </div>
          <div className="card">
            <div className="space-y-2">
              {data.deliverables.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{d.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs text-white ${
                    d.status === 'completed' ? 'bg-success-green' : 'bg-focus-orange'
                  }`}>
                    {d.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Side Project */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🍷</span>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              ValleySomm Progress
            </h2>
          </div>
          <div className="card border-focus-orange/30 bg-focus-orange/5">
            <ul className="space-y-1">
              {data.sideProjectHighlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-focus-orange">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        {/* Wins & Challenges */}
        <section className="mb-6">
          {/* Headers Row */}
          <div className="mb-3 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success-green" />
              <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
                Top Wins
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-warning-red" />
              <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
                Challenges
              </h2>
            </div>
          </div>
          {/* Cards Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card border-success-green/30 bg-success-green/5">
              <ul className="space-y-2">
                {data.topWins.map((w, idx) => (
                  <li key={idx} className="text-sm text-text-secondary">{w}</li>
                ))}
              </ul>
            </div>
            <div className="card border-warning-red/30 bg-warning-red/5">
              <ul className="space-y-2">
                {data.topChallenges.map((c, idx) => (
                  <li key={idx} className="text-sm text-text-secondary">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
        {/* One Changes */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-streak-gold" />
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Changes Committed To
            </h2>
          </div>
          <div className="card border-streak-gold/30 bg-streak-gold/5">
            <ul className="space-y-2">
              {data.oneChanges.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-streak-gold font-bold">{idx + 1}.</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        {/* Export */}
        <div className="text-center">
          <Button variant="secondary">
            Export {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Report
          </Button>
          <p className="mt-2 text-xs text-text-secondary">
            Download as PDF for performance reviews
          </p>
        </div>
      </main>
    </div>
  );
}
