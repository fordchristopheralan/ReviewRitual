'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReviewLayout } from '../layout-wrapper';
import { Button, Checkbox, Textarea } from '@/components/ui';
import { ArrowRight, AlertCircle, Inbox } from 'lucide-react';

const INBOX_SOURCES = [
  { id: 'email', label: 'Email inbox' },
  { id: 'slack', label: 'Slack/Teams starred messages' },
  { id: 'notes', label: 'Notes app / random scraps' },
  { id: 'texts', label: 'Text messages with open loops' },
  { id: 'mental', label: 'Mental "oh crap" thoughts' },
  { id: 'calendar', label: 'Calendar items needing action' },
];

export default function ClearDecksPage() {
  const router = useRouter();
  const [inboxes, setInboxes] = useState<Record<string, boolean>>({});
  const [captureNotes, setCaptureNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  const toggleInbox = (id: string) => {
    setInboxes(prev => ({ ...prev, [id]: !prev[id] }));
    clearValidation();
  };
  
  const clearValidation = () => {
    if (showValidation) setShowValidation(false);
  };
  
  const allInboxesChecked = INBOX_SOURCES.every(source => inboxes[source.id]);
  const hasCaptureNotes = captureNotes.trim().length > 0;
  const isValid = allInboxesChecked && hasCaptureNotes;
  
  const handleNext = async () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/review/2-commit');
  };
  
  return (
    <ReviewLayout 
      currentStep={1}
      stepTitle="Clear the Decks"
      timeEstimate="15-20 min"
    >
      <div className="space-y-6">
        <p className="font-body text-text-secondary">
          Empty all inboxes into ONE capture list. Don't organize yet — just dump.
        </p>
        
        {/* CliftonStrengths Callout */}
        <div className="flex items-start gap-3 rounded-lg border-2 border-focus-orange/30 bg-focus-orange/5 p-4">
          <Inbox className="h-5 w-5 flex-shrink-0 text-focus-orange mt-0.5" />
          <div className="font-body text-sm text-text-secondary">
            <strong className="text-focus-orange">Your Input (#8) collects from everywhere.</strong> This step 
            gathers all those scattered inputs into one place so your Arranger (#9) can organize them later.
          </div>
        </div>
        
        {/* Validation Warning */}
        {showValidation && !isValid && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-warning-red bg-warning-red/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-red mt-0.5" />
            <div className="font-body text-sm text-warning-red">
              <strong>Complete all items before continuing:</strong>
              <ul className="mt-1 list-disc list-inside">
                {!allInboxesChecked && <li>Process all inbox sources</li>}
                {!hasCaptureNotes && <li>Capture at least one item in the notes field</li>}
              </ul>
            </div>
          </div>
        )}
        
        {/* Inbox Sources */}
        <div className="card">
          <h2 className="mb-4 font-display text-sm uppercase tracking-wider text-text-secondary">
            Inbox Sources
          </h2>
          <div className="space-y-3">
            {INBOX_SOURCES.map(source => (
              <Checkbox
                key={source.id}
                label={source.label}
                checked={inboxes[source.id] || false}
                onChange={() => toggleInbox(source.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Capture Field */}
        <div className="card">
          <Textarea
            label="Quick Capture"
            placeholder="Dump anything on your mind here before moving on..."
            value={captureNotes}
            onChange={(e) => { setCaptureNotes(e.target.value); clearValidation(); }}
            rows={6}
            error={showValidation && !hasCaptureNotes ? "Capture at least one item before continuing" : undefined}
          />
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Dashboard
            </Button>
          </Link>
          
          <Button onClick={handleNext} isLoading={isSaving}>
            Next: Commitments
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
