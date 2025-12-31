'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, CheckCircle, Inbox, Users, Telescope, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

// Mock data - will come from Supabase
const MOCK_REVIEW = {
  id: '1',
  weekOf: '2024-12-23',
  completedAt: '2024-12-29T17:45:00',
  durationMinutes: 42,
  
  // Step 1: Clear the Decks
  inboxesProcessed: ['email', 'slack', 'notes', 'texts', 'mental', 'calendar'],
  captureNotes: 'Follow up with design team on new mockups\nSchedule dentist appointment\nResearch competitor pricing for ValleySomm\nBuy anniversary gift',
  
  // Step 2: Commitments
  teamCommitments: [
    { person: 'Sarah (Senior Dev)', commitment: 'Review her promotion packet by Wednesday', status: 'on_track' },
    { person: 'Mike (New Hire)', commitment: 'Weekly check-in, assign first solo project', status: 'completed' },
    { person: 'Leadership', commitment: 'Prepare Q1 headcount request', status: 'at_risk' },
  ],
  deliverables: [
    { name: 'Q4 Planning Doc', dueDate: '2024-12-27', status: 'completed' },
    { name: 'Budget Reconciliation', dueDate: '2024-12-31', status: 'in_progress' },
  ],
  budgetAdmin: 'Approve PTO requests for holiday week. Submit expense report from conference.',
  sideProjectNotes: 'Shipped the chat quiz prototype! Got good feedback on the flow. Next: pricing page and Stripe integration.',
  
  // Step 3: Look Ahead
  calendarConflicts: 'Thursday is packed with back-to-backs. Need to move 1:1 with Sarah to Friday. Friday afternoon blocked for deep work.',
  keyMeetings: 'Monday: Team standup, Q1 kickoff planning\nWednesday: Skip-level with VP\nThursday: All-hands, budget review',
  bigThree: ['Ship ValleySomm beta', 'Complete Q4 reviews', 'Plan holiday coverage'],
  
  // Step 4: Protect Time
  focusBlocks: ['deep_work', 'valleysomm', 'meeting_free', 'prep_time', 'buffer'],
  timeAudit: 'Last week: Too many context switches on Tuesday. Got pulled into 3 "quick calls" that weren\'t quick. This week: Decline any meeting without an agenda.',
  
  // Step 5: Reflect
  whatWorked: 'Morning deep work blocks before Slack were amazing. Got more done by 10am than usual full day. Also: saying "let me check my calendar" instead of instant yes to meetings.',
  whatDidnt: 'Skipped lunch 3 days. Energy crashed by 3pm. Also let email pile up by trying to batch it - need to find middle ground.',
  oneChange: 'Block 2 hours for deep work every morning before checking Slack',
};

const STATUS_COLORS: Record<string, string> = {
  on_track: 'bg-success-green',
  at_risk: 'bg-streak-gold',
  blocked: 'bg-warning-red',
  completed: 'bg-rest-blue',
  not_started: 'bg-medium-gray',
  in_progress: 'bg-focus-orange',
};

const STATUS_LABELS: Record<string, string> = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  blocked: 'Blocked',
  completed: 'Completed',
  not_started: 'Not Started',
  in_progress: 'In Progress',
};

function formatWeekOf(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatCompletedAt(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) +
    ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function ReviewDetailPage() {
  const params = useParams();
  const review = MOCK_REVIEW; // In real app, fetch by params.id
  
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
        <Link href="/history" className="mb-6 inline-flex items-center gap-1 text-sm text-focus-orange hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-6 w-6 text-success-green" />
            <h1 className="font-display text-2xl font-bold text-coach-charcoal">
              Week of {formatWeekOf(review.weekOf)}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatCompletedAt(review.completedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {review.durationMinutes} minutes
            </span>
          </div>
        </div>
        
        {/* Section 1: Clear the Decks */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-focus-orange">
              <Inbox className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              1. Clear the Decks
            </h2>
          </div>
          <div className="card">
            <p className="text-sm text-text-secondary mb-3">
              <strong className="text-coach-charcoal">{review.inboxesProcessed.length} inboxes processed</strong>
            </p>
            <div className="bg-warm-gray/50 rounded-lg p-3">
              <p className="text-sm font-medium text-coach-charcoal mb-1">Captured:</p>
              <p className="text-sm text-text-secondary whitespace-pre-line">{review.captureNotes}</p>
            </div>
          </div>
        </section>
        
        {/* Section 2: Commitments */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-green">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              2. Review Commitments
            </h2>
          </div>
          <div className="space-y-3">
            {/* Team */}
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-3">Team & Leadership</p>
              <div className="space-y-2">
                {review.teamCommitments.map((c, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 text-sm">
                    <div>
                      <span className="font-medium text-coach-charcoal">{c.person}:</span>{' '}
                      <span className="text-text-secondary">{c.commitment}</span>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs text-white ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Deliverables */}
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-3">Deliverables</p>
              <div className="space-y-2">
                {review.deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-text-secondary">{d.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs text-white ${STATUS_COLORS[d.status]}`}>
                      {STATUS_LABELS[d.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Budget & Admin */}
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-1">Budget & Admin</p>
              <p className="text-sm text-text-secondary">{review.budgetAdmin}</p>
            </div>
            
            {/* ValleySomm */}
            <div className="card border-focus-orange/30 bg-focus-orange/5">
              <p className="text-sm font-medium text-focus-orange mb-1">🍷 ValleySomm Progress</p>
              <p className="text-sm text-text-secondary">{review.sideProjectNotes}</p>
            </div>
          </div>
        </section>
        
        {/* Section 3: Look Ahead */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-streak-gold">
              <Telescope className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              3. Look Ahead
            </h2>
          </div>
          <div className="space-y-3">
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-1">Calendar & Prep</p>
              <p className="text-sm text-text-secondary">{review.calendarConflicts}</p>
            </div>
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-1">Key Meetings</p>
              <p className="text-sm text-text-secondary whitespace-pre-line">{review.keyMeetings}</p>
            </div>
            <div className="card border-streak-gold/30 bg-streak-gold/5">
              <p className="text-sm font-medium text-streak-gold mb-2">The Big 3</p>
              <div className="space-y-1">
                {review.bigThree.map((item, idx) => (
                  <p key={idx} className="text-sm text-text-secondary">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-streak-gold text-xs font-bold text-white mr-2">
                      {idx + 1}
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 4: Protect Time */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-focus-orange">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              4. Protect Your Time
            </h2>
          </div>
          <div className="space-y-3">
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-2">Focus Blocks Scheduled</p>
              <div className="flex flex-wrap gap-2">
                {review.focusBlocks.map(block => (
                  <span key={block} className="rounded-full bg-success-green/20 px-3 py-1 text-xs font-medium text-success-green">
                    ✓ {block.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <p className="text-sm font-medium text-coach-charcoal mb-1">Time Audit</p>
              <p className="text-sm text-text-secondary">{review.timeAudit}</p>
            </div>
          </div>
        </section>
        
        {/* Section 5: Reflect */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-streak-gold">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              5. Quick Reflection
            </h2>
          </div>
          <div className="space-y-3">
            <div className="card border-success-green/30 bg-success-green/5">
              <p className="text-sm font-medium text-success-green mb-1">What worked well</p>
              <p className="text-sm text-text-secondary">{review.whatWorked}</p>
            </div>
            <div className="card border-warning-red/30 bg-warning-red/5">
              <p className="text-sm font-medium text-warning-red mb-1">What didn't work</p>
              <p className="text-sm text-text-secondary">{review.whatDidnt}</p>
            </div>
            <div className="card border-streak-gold/30 bg-streak-gold/5">
              <p className="text-sm font-medium text-streak-gold mb-1">One change for next week</p>
              <p className="text-sm text-text-secondary">{review.oneChange}</p>
            </div>
          </div>
        </section>
        
        {/* Back to History */}
        <div className="text-center">
          <Link href="/history">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
