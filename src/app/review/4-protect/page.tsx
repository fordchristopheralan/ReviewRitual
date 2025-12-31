'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReviewLayout } from '../layout-wrapper';
import { Button, Checkbox, Textarea } from '@/components/ui';
import { ArrowLeft, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react';

const FOCUS_BLOCKS = [
  { id: 'deep_work', label: 'Deep work block (2+ hours)', description: 'Protected time for complex thinking' },
  { id: 'valleysomm', label: 'ValleySomm time', description: 'Side project protected time' },
  { id: 'meeting_free', label: 'Meeting-free morning(s)', description: 'At least one morning without meetings' },
  { id: 'prep_time', label: '1:1 prep time', description: 'Before your direct report meetings' },
  { id: 'buffer', label: 'Buffer blocks', description: 'Things always take longer than planned' },
];

export default function ProtectTimePage() {
  const router = useRouter();
  const [focusBlocks, setFocusBlocks] = useState<Record<string, boolean>>({});
  const [timeAudit, setTimeAudit] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  const toggleBlock = (id: string) => {
    setFocusBlocks(prev => ({ ...prev, [id]: !prev[id] }));
    clearValidation();
  };
  
  const clearValidation = () => {
    if (showValidation) setShowValidation(false);
  };
  
  // Validation
  const checkedCount = Object.values(focusBlocks).filter(Boolean).length;
  const allBlocksChecked = checkedCount === FOCUS_BLOCKS.length;
  const hasTimeAudit = timeAudit.trim().length > 0;
  const isValid = allBlocksChecked && hasTimeAudit;
  
  const handleNext = async () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/review/5-reflect');
  };
  
  return (
    <ReviewLayout
      currentStep={4}
      stepTitle="Protect Your Time"
      timeEstimate="5-10 min"
    >
      <div className="space-y-6">
        <p className="font-body text-text-secondary">
          If it's not on the calendar, it won't happen.
        </p>
        
        {/* CliftonStrengths Callout */}
        <div className="flex items-start gap-3 rounded-lg border-2 border-focus-orange/30 bg-focus-orange/5 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-focus-orange mt-0.5" />
          <div className="font-body text-sm text-text-secondary">
            <strong className="text-focus-orange">Your Discipline is #33.</strong> Without scheduled blocks, 
            your Achiever (#6) will fill empty time with reactive busywork. Protect thinking time intentionally.
          </div>
        </div>
        
        {/* Validation Warning */}
        {showValidation && !isValid && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-warning-red bg-warning-red/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-red mt-0.5" />
            <div className="font-body text-sm text-warning-red">
              <strong>Complete all items before continuing:</strong>
              <ul className="mt-1 list-disc list-inside">
                {!allBlocksChecked && <li>Schedule all {FOCUS_BLOCKS.length} focus blocks ({checkedCount}/{FOCUS_BLOCKS.length} checked)</li>}
                {!hasTimeAudit && <li>Complete the time audit reflection</li>}
              </ul>
            </div>
          </div>
        )}
        
        {/* Focus Blocks */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Schedule These Blocks
            </h2>
            <span className={`font-display text-sm ${allBlocksChecked ? 'text-success-green' : 'text-medium-gray'}`}>
              {checkedCount}/{FOCUS_BLOCKS.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {FOCUS_BLOCKS.map(block => (
              <div
                key={block.id}
                className={`rounded-lg border-2 p-4 transition-colors ${
                  focusBlocks[block.id] 
                    ? 'border-success-green bg-success-green/5' 
                    : showValidation && !focusBlocks[block.id]
                      ? 'border-warning-red/50 bg-warning-red/5'
                      : 'border-warm-gray'
                }`}
              >
                <Checkbox
                  label={block.label}
                  checked={focusBlocks[block.id] || false}
                  onChange={() => toggleBlock(block.id)}
                />
                <p className="mt-1 pl-8 text-sm text-text-secondary">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Audit */}
        <div className="card">
          <Textarea
            label="Time Audit"
            placeholder="What stole your time last week? What will you protect this week?"
            value={timeAudit}
            onChange={(e) => { setTimeAudit(e.target.value); clearValidation(); }}
            error={showValidation && !hasTimeAudit ? "Required" : undefined}
          />
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/review/3-ahead">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <Button onClick={handleNext} isLoading={isSaving}>
            Next: Reflect
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
