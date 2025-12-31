'use client';

import Link from 'next/link';
import { ProgressSteps } from '@/components/ui';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatTimeElapsed } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ReviewLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  stepTitle: string;
  timeEstimate: string;
}

export function ReviewLayout({ children, currentStep, stepTitle, timeEstimate }: ReviewLayoutProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-coach-charcoal">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {/* Top row: Logo and Timer */}
          <div className="mb-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 -rotate-3 items-center justify-center rounded-lg bg-focus-orange font-display text-xs font-bold text-white">
                RR
              </div>
              <span className="font-display text-base font-bold text-white">
                Review<span className="text-focus-orange">Ritual</span>
              </span>
            </Link>
            
            {/* Session Timer */}
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="h-4 w-4" />
              <span className="font-display text-sm">
                {formatTimeElapsed(elapsedSeconds)}
              </span>
            </div>
          </div>
          
          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} className="pb-2" />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Step Header */}
        <div className="mb-6">
          <p className="font-display text-xs uppercase tracking-widest text-focus-orange">
            Step {currentStep} of 5 • {timeEstimate}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-coach-charcoal">
            {stepTitle}
          </h1>
        </div>
        
        {children}
      </main>
    </div>
  );
}
