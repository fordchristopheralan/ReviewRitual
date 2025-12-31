'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Trophy, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

// Mock data - will come from Supabase
const MOCK_STREAK = {
  current: 13, // Just completed week 13
  longest: 16,
  total: 47,
};

const MILESTONES = [
  { week: 4, message: "One month of consistent reviews. The habit is forming." },
  { week: 8, message: "Two months strong. You're building something real." },
  { week: 12, message: "That's a quarter of reviews. Keep building." },
  { week: 26, message: "Half a year. This is who you are now." },
  { week: 52, message: "One year of weekly reviews. Exceptional." },
];

export default function CompletePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const streak = MOCK_STREAK;
  
  // Check for milestone
  const milestone = MILESTONES.find(m => m.week === streak.current);
  const isNewRecord = streak.current > streak.longest;
  
  useEffect(() => {
    // Trigger celebration animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
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
      
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-green ${showConfetti ? 'animate-scale-in' : ''}`}>
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
          
          {/* Main Message */}
          <h1 className="mb-2 font-display text-4xl font-bold text-coach-charcoal">
            Week {streak.current} Complete
          </h1>
          
          {/* Milestone or Standard Message */}
          {milestone ? (
            <div className="mx-auto mb-8 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-streak-gold/20 px-4 py-2 text-streak-gold">
                <Trophy className="h-5 w-5" />
                <span className="font-display text-sm font-bold">MILESTONE</span>
              </div>
              <p className="mt-3 text-lg text-text-secondary">
                {milestone.message}
              </p>
            </div>
          ) : isNewRecord ? (
            <div className="mx-auto mb-8 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-streak-gold/20 px-4 py-2 text-streak-gold">
                <Trophy className="h-5 w-5" />
                <span className="font-display text-sm font-bold">NEW RECORD</span>
              </div>
              <p className="mt-3 text-lg text-text-secondary">
                You just beat your longest streak!
              </p>
            </div>
          ) : (
            <p className="mb-8 text-lg text-text-secondary">
              Another week of clarity. Keep the momentum going.
            </p>
          )}
          
          {/* Streak Display */}
          <div className="mb-8 rounded-2xl bg-coach-charcoal p-8">
            <div className="mb-6">
              <div className="font-display text-6xl font-bold text-streak-gold">
                {streak.current}
              </div>
              <div className="font-display text-xs uppercase tracking-widest text-medium-gray">
                Week Streak
              </div>
            </div>
            
            <div className="flex justify-center gap-8 border-t border-coach-slate pt-6">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-success-green">
                  {Math.max(streak.longest, streak.current)}
                </div>
                <div className="text-xs text-medium-gray">Best</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-white">
                  {streak.total}
                </div>
                <div className="text-xs text-medium-gray">Total</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-white">
                  {Math.round((streak.total / (streak.total + 4)) * 100)}%
                </div>
                <div className="text-xs text-medium-gray">Rate</div>
              </div>
            </div>
          </div>
          
          {/* Next Review Reminder */}
          <div className="mb-8 flex items-center justify-center gap-2 text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Next review: Sunday, 5:00 PM</span>
          </div>
          
          {/* CTA */}
          <Link href="/">
            <Button size="lg">
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
