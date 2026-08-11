-- ============================================================
-- URL Redirect Manager + 404 Log
-- Run this in Supabase Dashboard → SQL Editor.
-- Safe to run more than once.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Redirect rules
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Always stored normalised: lowercase, leading slash, no trailing slash.
    from_path TEXT NOT NULL UNIQUE,
    -- Either a site-relative path ("/products/steel-beam") or a full URL.
    to_path TEXT NOT NULL,
    status_code SMALLINT NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
    is_active BOOLEAN NOT NULL DEFAULT true,
    hits INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- A rule pointing at itself would loop forever.
    CONSTRAINT redirects_no_self_loop CHECK (from_path <> to_path)
);

CREATE INDEX IF NOT EXISTS redirects_active_idx
    ON public.redirects (from_path) WHERE is_active;

ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- The proxy resolves redirects with the anon key on every request, so the
-- rules must be publicly readable. They contain no sensitive data.
DROP POLICY IF EXISTS "Public read active redirects" ON public.redirects;
CREATE POLICY "Public read active redirects"
    ON public.redirects FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins full redirects" ON public.redirects;
CREATE POLICY "Admins full redirects"
    ON public.redirects FOR ALL TO authenticated
    USING (true) WITH CHECK (true);


-- ------------------------------------------------------------
-- 2. 404 log
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.not_found_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    hits INTEGER NOT NULL DEFAULT 1,
    referrer TEXT,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS not_found_log_last_seen_idx
    ON public.not_found_log (last_seen DESC);

ALTER TABLE public.not_found_log ENABLE ROW LEVEL SECURITY;

-- Deliberately no public policy: anonymous visitors write through the
-- SECURITY DEFINER function below and can never read the log back.
DROP POLICY IF EXISTS "Admins full not_found_log" ON public.not_found_log;
CREATE POLICY "Admins full not_found_log"
    ON public.not_found_log FOR ALL TO authenticated
    USING (true) WITH CHECK (true);


-- ------------------------------------------------------------
-- 3. Atomic 404 recorder
-- ------------------------------------------------------------
-- One row per path with a counter, rather than a row per hit, so a crawler
-- hammering a dead URL cannot flood the table. SECURITY DEFINER lets anonymous
-- visitors increment the counter without any direct table permission.
CREATE OR REPLACE FUNCTION public.log_not_found(p_path TEXT, p_referrer TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Ignore junk: oversized paths and anything that is not a site page.
    IF p_path IS NULL OR length(p_path) > 512 OR left(p_path, 1) <> '/' THEN
        RETURN;
    END IF;

    INSERT INTO public.not_found_log (path, referrer)
    VALUES (p_path, left(p_referrer, 512))
    ON CONFLICT (path) DO UPDATE
        SET hits = not_found_log.hits + 1,
            last_seen = now(),
            referrer = COALESCE(EXCLUDED.referrer, not_found_log.referrer);
END;
$$;

REVOKE ALL ON FUNCTION public.log_not_found(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_not_found(TEXT, TEXT) TO anon, authenticated;


-- ------------------------------------------------------------
-- 4. Redirect hit counter
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bump_redirect_hit(p_from_path TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.redirects
       SET hits = hits + 1
     WHERE from_path = p_from_path;
END;
$$;

REVOKE ALL ON FUNCTION public.bump_redirect_hit(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bump_redirect_hit(TEXT) TO anon, authenticated;


-- ------------------------------------------------------------
-- 5. Keep updated_at honest
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_redirects_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS redirects_set_updated_at ON public.redirects;
CREATE TRIGGER redirects_set_updated_at
    BEFORE UPDATE ON public.redirects
    FOR EACH ROW EXECUTE FUNCTION public.touch_redirects_updated_at();
