'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReviewLayout } from '../layout-wrapper';
import { Button, Textarea } from '@/components/ui';
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function ReflectPage() {
  const router = useRouter();
  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidnt, setWhatDidnt] = useState('');
  const [oneChange, setOneChange] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  const clearValidation = () => {
    if (showValidation) setShowValidation(false);
  };
  
  // Validation
  const hasWhatWorked = whatWorked.trim().length > 0;
  const hasWhatDidnt = whatDidnt.trim().length > 0;
  const hasOneChange = oneChange.trim().length > 0;
  const isValid = hasWhatWorked && hasWhatDidnt && hasOneChange;
  
  const handleNext = async () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/review/complete');
  };
  
  return (
    <ReviewLayout
      currentStep={5}
      stepTitle="Quick Reflection"
      timeEstimate="5 min"
    >
      <div className="space-y-6">
        <p className="font-body text-text-secondary">
          Feed your Learner. Improve the system over time.
        </p>
        
        {/* CliftonStrengths Callout */}
        <div className="flex items-start gap-3 rounded-lg border-2 border-streak-gold/30 bg-streak-gold/5 p-4">
          <Sparkles className="h-5 w-5 flex-shrink-0 text-streak-gold mt-0.5" />
          <div className="font-body text-sm text-text-secondary">
            <strong className="text-streak-gold">Your Learner (#5) craves growth; your Restorative (#1) spots what's broken.</strong> This 
            step turns both into action — capture what worked, identify problems, and commit to one improvement.
          </div>
        </div>
        
        {/* Validation Warning */}
        {showValidation && !isValid && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-warning-red bg-warning-red/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-red mt-0.5" />
            <div className="font-body text-sm text-warning-red">
              <strong>Complete all sections before continuing:</strong>
              <ul className="mt-1 list-disc list-inside">
                {!hasWhatWorked && <li>Add what worked well</li>}
                {!hasWhatDidnt && <li>Add what didn't work</li>}
                {!hasOneChange && <li>Commit to one change for next week</li>}
              </ul>
            </div>
          </div>
        )}
        
        {/* What Worked */}
        <div className="card border-success-green/30 bg-success-green/5">
          <Textarea
            label="What worked well last week?"
            placeholder="Wins, breakthroughs, things to repeat..."
            value={whatWorked}
            onChange={(e) => { setWhatWorked(e.target.value); clearValidation(); }}
            error={showValidation && !hasWhatWorked ? "Required" : undefined}
          />
        </div>
        
        {/* What Didn't Work */}
        <div className="card border-warning-red/30 bg-warning-red/5">
          <Textarea
            label="What didn't work? (Your Restorative will love this)"
            placeholder="Problems to fix, friction points, energy drains..."
            value={whatDidnt}
            onChange={(e) => { setWhatDidnt(e.target.value); clearValidation(); }}
            error={showValidation && !hasWhatDidnt ? "Required" : undefined}
          />
        </div>
        
        {/* One Change */}
        <div className="card border-streak-gold/30 bg-streak-gold/5">
          <Textarea
            label="One thing to do differently this week"
            placeholder="Just one. Make it specific and actionable."
            value={oneChange}
            onChange={(e) => { setOneChange(e.target.value); clearValidation(); }}
            rows={3}
            error={showValidation && !hasOneChange ? "Required" : undefined}
          />
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/review/4-protect">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <Button onClick={handleNext} isLoading={isSaving}>
            Complete Review
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
