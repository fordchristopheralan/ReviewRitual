-- ReviewRitual Database Schema
-- Version 1.1 - MVP with Family Commitments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    -- Review preferences
    review_day INTEGER DEFAULT 0, -- 0 = Sunday, 1 = Monday, etc.
    review_time TIME DEFAULT '17:00:00', -- Default 5pm
    timezone TEXT DEFAULT 'America/New_York',
    -- Notification preferences
    push_enabled BOOLEAN DEFAULT TRUE,
    email_reminders BOOLEAN DEFAULT TRUE,
    escalation_enabled BOOLEAN DEFAULT TRUE,
    -- Appearance
    dark_mode BOOLEAN DEFAULT FALSE,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Week identification
    week_number INTEGER NOT NULL, -- ISO week number
    year INTEGER NOT NULL,
    week_start_date DATE NOT NULL, -- Sunday of the week
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    current_step INTEGER DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 5),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Part 1: Clear the Decks
    inbox_email BOOLEAN DEFAULT FALSE,
    inbox_slack BOOLEAN DEFAULT FALSE,
    inbox_calendar BOOLEAN DEFAULT FALSE,
    inbox_notes BOOLEAN DEFAULT FALSE,
    inbox_physical BOOLEAN DEFAULT FALSE,
    inbox_voicememos BOOLEAN DEFAULT FALSE,
    capture_notes TEXT,
    
    -- Part 2: Review Commitments
    team_commitments JSONB DEFAULT '[]'::JSONB,
    -- Format: [{"id": "uuid", "person": "Name", "commitment": "What", "status": "on_track|at_risk|blocked|completed"}]
    
    family_commitments JSONB DEFAULT '[]'::JSONB,
    -- Format: [{"id": "uuid", "person": "Name", "need": "What they need"}]
    
    deliverables JSONB DEFAULT '[]'::JSONB,
    -- Format: [{"id": "uuid", "name": "Project", "dueDate": "2024-01-15", "status": "not_started|in_progress|completed|blocked"}]
    
    budget_admin TEXT,
    side_project_notes TEXT, -- ValleySomm work
    
    -- Part 3: Look Ahead
    calendar_conflicts TEXT,
    key_meetings TEXT,
    big_three JSONB DEFAULT '["", "", ""]'::JSONB,
    
    -- Part 4: Protect Your Time
    focus_blocks JSONB DEFAULT '{"deep_work": false, "one_on_one_prep": false, "meeting_free_morning": false, "side_project": false, "buffer": false}'::JSONB,
    time_audit TEXT,
    
    -- Part 5: Quick Reflection
    what_worked TEXT,
    what_didnt TEXT,
    one_change TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one review per week per user
    UNIQUE(user_id, year, week_number)
);

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    last_completed_week DATE, -- Week start date of last completed review
    streak_started_at DATE, -- When current streak began
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REMINDERS TABLE (for tracking sent reminders)
-- ============================================
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('scheduled', 'followup_4h', 'streak_risk', 'final_warning')),
    channel TEXT NOT NULL CHECK (channel IN ('push', 'email')),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    snoozed_until TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_week ON public.reviews(year, week_number);
CREATE INDEX IF NOT EXISTS idx_reviews_week_start ON public.reviews(week_start_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_review_id ON public.reminders(review_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Reviews: Users can only see/edit their own reviews
CREATE POLICY "Users can view own reviews" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Streaks: Users can only see/edit their own streak
CREATE POLICY "Users can view own streak" ON public.streaks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON public.streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Reminders: Users can only see their own reminders
CREATE POLICY "Users can view own reminders" ON public.reminders
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get the current week's start date (Sunday)
CREATE OR REPLACE FUNCTION get_week_start(d DATE DEFAULT CURRENT_DATE)
RETURNS DATE AS $$
BEGIN
    RETURN d - EXTRACT(DOW FROM d)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate completion rate
CREATE OR REPLACE FUNCTION calculate_completion_rate(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_weeks INTEGER;
    completed_weeks INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_weeks
    FROM public.reviews
    WHERE user_id = p_user_id;
    
    SELECT COUNT(*) INTO completed_weeks
    FROM public.reviews
    WHERE user_id = p_user_id AND status = 'completed';
    
    IF total_weeks = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((completed_weeks::NUMERIC / total_weeks::NUMERIC) * 100, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate average review time in minutes
CREATE OR REPLACE FUNCTION calculate_avg_review_time(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    avg_seconds NUMERIC;
BEGIN
    SELECT AVG(time_spent_seconds) INTO avg_seconds
    FROM public.reviews
    WHERE user_id = p_user_id AND status = 'completed' AND time_spent_seconds > 0;
    
    IF avg_seconds IS NULL THEN
        RETURN 45; -- Default estimate
    END IF;
    
    RETURN ROUND(avg_seconds / 60);
END;
$$ LANGUAGE plpgsql;

-- Function to update streak after review completion
CREATE OR REPLACE FUNCTION update_streak_on_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_last_week DATE;
    v_current_week DATE;
    v_streak_record RECORD;
BEGIN
    -- Only run when status changes to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        v_current_week := NEW.week_start_date;
        
        -- Get or create streak record
        SELECT * INTO v_streak_record
        FROM public.streaks
        WHERE user_id = NEW.user_id;
        
        IF NOT FOUND THEN
            -- Create new streak record
            INSERT INTO public.streaks (user_id, current_streak, longest_streak, total_reviews, last_completed_week, streak_started_at)
            VALUES (NEW.user_id, 1, 1, 1, v_current_week, v_current_week);
        ELSE
            v_last_week := v_streak_record.last_completed_week;
            
            -- Check if this extends the streak (completed within 7-14 days of last)
            IF v_last_week IS NULL OR (v_current_week - v_last_week) BETWEEN 7 AND 14 THEN
                -- Streak continues or starts
                UPDATE public.streaks
                SET 
                    current_streak = CASE 
                        WHEN v_last_week IS NULL THEN 1
                        WHEN (v_current_week - v_last_week) BETWEEN 7 AND 14 THEN current_streak + 1
                        ELSE 1
                    END,
                    longest_streak = GREATEST(longest_streak, 
                        CASE 
                            WHEN v_last_week IS NULL THEN 1
                            WHEN (v_current_week - v_last_week) BETWEEN 7 AND 14 THEN current_streak + 1
                            ELSE 1
                        END
                    ),
                    total_reviews = total_reviews + 1,
                    last_completed_week = v_current_week,
                    streak_started_at = CASE 
                        WHEN v_last_week IS NULL OR (v_current_week - v_last_week) > 14 THEN v_current_week
                        ELSE streak_started_at
                    END,
                    updated_at = NOW()
                WHERE user_id = NEW.user_id;
            ELSE
                -- Streak broken (more than 14 days gap)
                UPDATE public.streaks
                SET 
                    current_streak = 1,
                    total_reviews = total_reviews + 1,
                    last_completed_week = v_current_week,
                    streak_started_at = v_current_week,
                    updated_at = NOW()
                WHERE user_id = NEW.user_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for streak updates
DROP TRIGGER IF EXISTS trigger_update_streak ON public.reviews;
CREATE TRIGGER trigger_update_streak
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_streak_on_completion();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTH TRIGGER: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.streaks (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
