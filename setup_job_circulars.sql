-- ============================================================
-- Job Circulars Table for Career Page
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.job_circulars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT NOT NULL DEFAULT 'Dhaka',
    job_type TEXT NOT NULL DEFAULT 'Full-time' CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
    experience TEXT,
    salary_range TEXT,
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_circulars ENABLE ROW LEVEL SECURITY;

-- Public can read ONLY active jobs
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read active jobs" ON public.job_circulars;
    CREATE POLICY "Public read active jobs"
        ON public.job_circulars
        FOR SELECT
        USING (is_active = true);
END $$;

-- Authenticated users (Admins) have full access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins full job_circulars" ON public.job_circulars;
    CREATE POLICY "Admins full job_circulars"
        ON public.job_circulars
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
END $$;
