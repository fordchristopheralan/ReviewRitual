'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReviewLayout } from '../layout-wrapper';
import { Button, Input, Textarea } from '@/components/ui';
import { ArrowLeft, ArrowRight, AlertCircle, Telescope } from 'lucide-react';

export default function LookAheadPage() {
  const router = useRouter();
  const [calendarConflicts, setCalendarConflicts] = useState('');
  const [keyMeetings, setKeyMeetings] = useState('');
  const [bigThree, setBigThree] = useState(['', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  const updateBigThree = (index: number, value: string) => {
    setBigThree(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    clearValidation();
  };
  
  const clearValidation = () => {
    if (showValidation) setShowValidation(false);
  };
  
  // Validation
  const hasCalendarConflicts = calendarConflicts.trim().length > 0;
  const hasKeyMeetings = keyMeetings.trim().length > 0;
  const hasAllBigThree = bigThree.every(item => item.trim().length > 0);
  const filledCount = bigThree.filter(item => item.trim().length > 0).length;
  const isValid = hasCalendarConflicts && hasKeyMeetings && hasAllBigThree;
  
  const handleNext = async () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/review/4-protect');
  };
  
  return (
    <ReviewLayout
      currentStep={3}
      stepTitle="Look Ahead"
      timeEstimate="10-15 min"
    >
      <div className="space-y-6">
        <p className="font-body text-text-secondary">
          Review the next 2 weeks. Spot collisions. Make decisions now.
        </p>
        
        {/* CliftonStrengths Callout */}
        <div className="flex items-start gap-3 rounded-lg border-2 border-streak-gold/30 bg-streak-gold/5 p-4">
          <Telescope className="h-5 w-5 flex-shrink-0 text-streak-gold mt-0.5" />
          <div className="font-body text-sm text-text-secondary">
            <strong className="text-streak-gold">Your Futuristic (#3) naturally looks ahead.</strong> This 
            step channels that energy into concrete priorities. Your Strategic (#4) will see multiple paths — pick the Big 3 that matter most.
          </div>
        </div>
        
        {/* Validation Warning */}
        {showValidation && !isValid && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-warning-red bg-warning-red/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-red mt-0.5" />
            <div className="font-body text-sm text-warning-red">
              <strong>Complete all sections before continuing:</strong>
              <ul className="mt-1 list-disc list-inside">
                {!hasCalendarConflicts && <li>Add calendar conflicts & prep needed</li>}
                {!hasKeyMeetings && <li>Add key meetings this week</li>}
                {!hasAllBigThree && <li>Set all 3 Big priorities ({filledCount}/3 filled)</li>}
              </ul>
            </div>
          </div>
        )}
        
        {/* Calendar Conflicts */}
        <div className="card">
          <Textarea
            label="Calendar Conflicts & Prep Needed"
            placeholder="What's coming up that needs attention? Any scheduling conflicts?"
            value={calendarConflicts}
            onChange={(e) => { setCalendarConflicts(e.target.value); clearValidation(); }}
            error={showValidation && !hasCalendarConflicts ? "Required" : undefined}
          />
        </div>
        
        {/* Key Meetings */}
        <div className="card">
          <Textarea
            label="Key Meetings This Week"
            placeholder="Important meetings and what you need to prepare..."
            value={keyMeetings}
            onChange={(e) => { setKeyMeetings(e.target.value); clearValidation(); }}
            error={showValidation && !hasKeyMeetings ? "Required" : undefined}
          />
        </div>
        
        {/* Big 3 Priorities */}
        <div className="card border-streak-gold/30 bg-streak-gold/5">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm uppercase tracking-wider text-streak-gold">
                The Big 3
              </h2>
              <span className={`font-display text-sm ${hasAllBigThree ? 'text-success-green' : 'text-streak-gold'}`}>
                {filledCount}/3
              </span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              What would make this week successful? At least one should be leadership-focused.
            </p>
          </div>
          
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-streak-gold font-display text-sm font-bold text-white">
                  {index + 1}
                </span>
                <Input
                  placeholder={`Priority ${index + 1}...`}
                  value={bigThree[index]}
                  onChange={(e) => updateBigThree(index, e.target.value)}
                  className="flex-1"
                  error={showValidation && !bigThree[index].trim() ? "Required" : undefined}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/review/2-commit">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <Button onClick={handleNext} isLoading={isSaving}>
            Next: Protect Time
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-center font-display text-xs text-medium-gray">
          ✓ Auto-saved
        </p>
      </div>
    </ReviewLayout>
  );
}
