'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

// Mock data - will come from Supabase
const MOCK_REVIEWS = [
  {
    id: '1',
    weekOf: '2024-12-23',
    completedAt: '2024-12-29T17:45:00',
    status: 'complete',
    durationMinutes: 42,
    bigThree: ['Ship ValleySomm beta', 'Complete Q4 reviews', 'Plan holiday coverage'],
    oneChange: 'Block 2 hours for deep work every morning before checking Slack',
  },
  {
    id: '2',
    weekOf: '2024-12-16',
    completedAt: '2024-12-22T18:12:00',
    status: 'complete',
    durationMinutes: 38,
    bigThree: ['Finalize team roadmap', 'ValleySomm pricing page', '1:1 with Sarah about promotion'],
    oneChange: 'Say no to at least one meeting that could be an email',
  },
  {
    id: '3',
    weekOf: '2024-12-09',
    completedAt: '2024-12-15T17:30:00',
    status: 'complete',
    durationMinutes: 51,
    bigThree: ['Launch internal demo', 'Budget reconciliation', 'Prepare board update'],
    oneChange: 'Take a real lunch break away from desk',
  },
  {
    id: '4',
    weekOf: '2024-12-02',
    completedAt: null,
    status: 'missed',
    durationMinutes: null,
    bigThree: [],
    oneChange: null,
  },
  {
    id: '5',
    weekOf: '2024-11-25',
    completedAt: '2024-12-01T16:55:00',
    status: 'complete',
    durationMinutes: 44,
    bigThree: ['Thanksgiving prep', 'Async team updates', 'ValleySomm winery data'],
    oneChange: 'Actually disconnect during holiday - no Slack on phone',
  },
  {
    id: '6',
    weekOf: '2024-11-18',
    completedAt: '2024-11-24T17:20:00',
    status: 'complete',
    durationMinutes: 39,
    bigThree: ['Quarterly planning kickoff', 'Review hiring pipeline', 'Side project architecture'],
    oneChange: 'Prep 1:1 agendas the night before, not morning of',
  },
];

function formatWeekOf(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCompletedAt(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'missed'>('all');
  
  const filteredReviews = MOCK_REVIEWS.filter(review => {
    // Status filter
    if (filterStatus !== 'all' && review.status !== filterStatus) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        ...review.bigThree,
        review.oneChange || '',
      ].join(' ').toLowerCase();
      return searchableText.includes(query);
    }
    
    return true;
  });
  
  const completedCount = MOCK_REVIEWS.filter(r => r.status === 'complete').length;
  const missedCount = MOCK_REVIEWS.filter(r => r.status === 'missed').length;
  
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
          <Link href="/settings" className="text-sm text-medium-gray hover:text-white">
            Settings
          </Link>
        </div>
      </header>
      
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-coach-charcoal">Review History</h1>
          <p className="text-text-secondary">Browse and search your past weekly reviews.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-medium-gray" />
            <input
              type="text"
              placeholder="Search Big 3, reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-lg border-2 border-warm-gray bg-white pl-10 pr-4 font-body text-text-primary placeholder:text-medium-gray focus:border-focus-orange focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-coach-charcoal text-white'
                  : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
              }`}
            >
              All ({MOCK_REVIEWS.length})
            </button>
            <button
              onClick={() => setFilterStatus('complete')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'complete'
                  ? 'bg-success-green text-white'
                  : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
              }`}
            >
              Complete ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('missed')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === 'missed'
                  ? 'bg-warning-red text-white'
                  : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
              }`}
            >
              Missed ({missedCount})
            </button>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-warm-gray p-8 text-center">
              <p className="text-text-secondary">No reviews found matching your search.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <Link
                key={review.id}
                href={review.status === 'complete' ? `/history/${review.id}` : '#'}
                className={`block rounded-xl border-2 bg-white p-4 transition-all ${
                  review.status === 'complete'
                    ? 'border-warm-gray hover:border-focus-orange hover:shadow-md'
                    : 'border-warning-red/30 bg-warning-red/5 cursor-default'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Week & Status */}
                    <div className="mb-2 flex items-center gap-2">
                      {review.status === 'complete' ? (
                        <CheckCircle className="h-5 w-5 text-success-green" />
                      ) : (
                        <XCircle className="h-5 w-5 text-warning-red" />
                      )}
                      <span className="font-display text-sm font-bold text-coach-charcoal">
                        Week of {formatWeekOf(review.weekOf)}
                      </span>
                    </div>
                    
                    {review.status === 'complete' ? (
                      <>
                        {/* Big 3 Preview */}
                        <div className="mb-2 space-y-1">
                          {review.bigThree.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-text-secondary truncate">
                              <span className="text-streak-gold font-medium">{idx + 1}.</span> {item}
                            </p>
                          ))}
                          {review.bigThree.length > 2 && (
                            <p className="text-xs text-medium-gray">+{review.bigThree.length - 2} more</p>
                          )}
                        </div>
                        
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-medium-gray">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatCompletedAt(review.completedAt!)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {review.durationMinutes} min
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-warning-red">Review not completed</p>
                    )}
                  </div>
                  
                  {review.status === 'complete' && (
                    <ChevronRight className="h-5 w-5 text-medium-gray" />
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        
        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-focus-orange hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
