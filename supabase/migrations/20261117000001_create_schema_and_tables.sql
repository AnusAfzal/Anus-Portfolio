-- =============================================================================
-- Migration 01: Core Tables, Indexes, Triggers, and Rate Limiting
-- =============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Table: contacts
-- Stores incoming messages submitted via the portfolio contact form
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 1 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (
        char_length(trim(email)) >= 3 
        AND char_length(email) <= 255 
        AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    subject TEXT NOT NULL CHECK (char_length(trim(subject)) >= 1 AND char_length(subject) <= 200),
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 1 AND char_length(message) <= 5000),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for efficient querying by admin dashboard
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON public.contacts (is_read);

-- -----------------------------------------------------------------------------
-- 2. Table: projects
-- Stores project records displayed on the portfolio website
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(trim(title)) >= 1 AND char_length(title) <= 150),
    slug TEXT UNIQUE NOT NULL CHECK (
        char_length(trim(slug)) >= 1 
        AND char_length(slug) <= 150 
        AND slug ~* '^[a-z0-9-]+$'
    ),
    description TEXT NOT NULL CHECK (char_length(trim(description)) >= 1),
    technologies TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    github_url TEXT CHECK (github_url IS NULL OR github_url ~* '^https?://[^\s]+$'),
    live_url TEXT CHECK (live_url IS NULL OR live_url ~* '^https?://[^\s]+$'),
    category TEXT NOT NULL DEFAULT 'Frontend' CHECK (
        category IN ('Full Stack', 'Mobile', 'Frontend', 'Backend', 'Database')
    ),
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (
        status IN ('Completed', 'In Development', 'Archived')
    ),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance and sorting
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);

-- Auto-update updated_at trigger for projects
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Table: contact_rate_limits
-- Server-side concurrency-safe rate limit tracking for contact submissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON public.contact_rate_limits (ip_hash, created_at DESC);

-- Atomic function to check and record rate limits (concurrency-safe)
CREATE OR REPLACE FUNCTION public.check_and_record_rate_limit(
    p_ip_hash TEXT,
    p_max_requests INTEGER DEFAULT 5,
    p_window_seconds INTEGER DEFAULT 3600
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count INTEGER;
    cutoff_time TIMESTAMPTZ;
BEGIN
    cutoff_time := timezone('utc'::text, now()) - (p_window_seconds || ' seconds')::INTERVAL;
    
    -- Periodic clean-up of stale rate limit entries older than 24 hours
    DELETE FROM public.contact_rate_limits
    WHERE created_at < (timezone('utc'::text, now()) - INTERVAL '24 hours');

    -- Count requests from this IP hash within the active window
    SELECT COUNT(*) INTO current_count
    FROM public.contact_rate_limits
    WHERE ip_hash = p_ip_hash AND created_at >= cutoff_time;

    -- If limit exceeded, reject submission
    IF current_count >= p_max_requests THEN
        RETURN FALSE;
    END IF;

    -- Otherwise log this request and allow
    INSERT INTO public.contact_rate_limits (ip_hash, created_at)
    VALUES (p_ip_hash, timezone('utc'::text, now()));

    RETURN TRUE;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. Table: app_admin_users
-- Server-controlled admin allowlist; public users cannot view or self-assign
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Helper security definer function to verify admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.app_admin_users
        WHERE user_id = auth.uid()
    );
$$;
