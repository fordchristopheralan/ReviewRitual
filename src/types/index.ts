// TypeScript types for ReviewRitual
// Auto-generated types would come from Supabase, but we define them here for development

export type ReviewStatus = 'not_started' | 'in_progress' | 'completed';
export type ReminderType = 'scheduled' | 'followup_4h' | 'streak_risk' | 'final_warning';
export type ReminderChannel = 'push' | 'email';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  review_day: number; // 0 = Sunday
  review_time: string; // HH:MM:SS format
  timezone: string;
  push_enabled: boolean;
  email_reminders: boolean;
  escalation_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamCommitment {
  id: string;
  person: string;
  commitment: string;
  status: 'on_track' | 'at_risk' | 'blocked' | 'completed';
  notes: string;
}

export interface Deliverable {
  id: string;
  name: string;
  due_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  notes: string;
}

export interface FocusBlocks {
  deep_work: boolean;
  side_project: boolean;
  meeting_free: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  week_number: number;
  year: number;
  week_start_date: string;
  status: ReviewStatus;
  current_step: number;
  started_at: string | null;
  completed_at: string | null;
  time_spent_seconds: number;
  
  // Part 1: Clear the Decks
  inbox_email: boolean;
  inbox_slack: boolean;
  inbox_calendar: boolean;
  inbox_notes: boolean;
  inbox_physical: boolean;
  inbox_voicememos: boolean;
  capture_notes: string | null;
  
  // Part 2: Review Commitments
  team_commitments: TeamCommitment[];
  deliverables: Deliverable[];
  budget_admin: string | null;
  side_project_notes: string | null;
  
  // Part 3: Look Ahead
  calendar_conflicts: string | null;
  key_meetings: string | null;
  big_three: [string, string, string];
  
  // Part 4: Protect Your Time
  focus_blocks: FocusBlocks;
  time_audit: string | null;
  
  // Part 5: Quick Reflection
  what_worked: string | null;
  what_didnt: string | null;
  one_change: string | null;
  
  // Completion checklist
  checklist_inbox_processed: boolean;
  checklist_commitments_reviewed: boolean;
  checklist_big_three_set: boolean;
  checklist_time_blocks_scheduled: boolean;
  checklist_reflection_completed: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_reviews: number;
  last_completed_week: string | null;
  streak_started_at: string | null;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  review_id: string | null;
  reminder_type: ReminderType;
  channel: ReminderChannel;
  sent_at: string;
  acknowledged_at: string | null;
  snoozed_until: string | null;
}

// Review step configuration
export const REVIEW_STEPS = [
  { step: 1, key: 'clear', label: 'Clear', fullLabel: 'Clear the Decks', timeEstimate: '15-20 min' },
  { step: 2, key: 'commit', label: 'Commit', fullLabel: 'Review Commitments', timeEstimate: '20-25 min' },
  { step: 3, key: 'ahead', label: 'Ahead', fullLabel: 'Look Ahead', timeEstimate: '10-15 min' },
  { step: 4, key: 'protect', label: 'Protect', fullLabel: 'Protect Your Time', timeEstimate: '5-10 min' },
  { step: 5, key: 'reflect', label: 'Reflect', fullLabel: 'Quick Reflection', timeEstimate: '5 min' },
] as const;

// Milestone configuration
export const MILESTONES = [
  { weeks: 4, message: "One month of consistent reviews. The habit is forming." },
  { weeks: 8, message: "Two months strong. You're building real momentum." },
  { weeks: 12, message: "That's a quarter of reviews. Keep building." },
  { weeks: 26, message: "Half a year. This is who you are now." },
  { weeks: 52, message: "One year of weekly reviews. Exceptional." },
] as const;

// Coach messages for reminders (per brand voice)
export const COACH_MESSAGES = {
  scheduled: "Your weekly review is ready. 45 minutes to protect next week.",
  followup_4h: "Still time today. Don't let the week close without your review.",
  streak_risk: (streak: number) => `${streak}-week streak on the line. One review stands between you and starting over.`,
  final_warning: "Last chance. Week closes in 2 hours.",
  completion: (week: number) => `Week ${week} complete.`,
  streak_broken: "Streak reset. Let's start fresh—Week 1 is ready.",
} as const;
