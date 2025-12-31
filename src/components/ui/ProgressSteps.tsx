'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { REVIEW_STEPS } from '@/types';
import { Inbox, Users, Calendar, Shield, Lightbulb } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

// Icons for each step
const STEP_ICONS = {
  clear: Inbox,        // Clear the Decks - emptying inboxes
  commit: Users,       // Review Commitments - team/people
  ahead: Calendar,     // Look Ahead - planning/calendar
  protect: Shield,     // Protect Your Time - defense/blocking
  reflect: Lightbulb,  // Quick Reflection - insights/ideas
} as const;

export function ProgressSteps({ currentStep, completedSteps = [], className }: ProgressStepsProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {REVIEW_STEPS.map((step) => {
        const isCompleted = completedSteps.includes(step.step) || step.step < currentStep;
        const isCurrent = step.step === currentStep;
        const Icon = STEP_ICONS[step.key as keyof typeof STEP_ICONS];
        
        return (
          <div key={step.key} className="flex flex-col items-center">
            {/* Icon */}
            <div
              className={cn(
                'mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                isCompleted && 'bg-success-green/20 text-success-green',
                isCurrent && !isCompleted && 'bg-focus-orange/20 text-focus-orange',
                !isCompleted && !isCurrent && 'bg-white/10 text-white/40'
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            
            {/* Step label */}
            <span
              className={cn(
                'font-display text-[10px] uppercase tracking-wider',
                isCompleted && 'text-success-green',
                isCurrent && !isCompleted && 'text-focus-orange',
                !isCompleted && !isCurrent && 'text-white/40'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
