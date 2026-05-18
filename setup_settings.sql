-- SQL script to create site_settings table and insert initial data

CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    hero_top_text TEXT NOT NULL DEFAULT 'City Steel Corporation · Est. 2009',
    hero_title TEXT NOT NULL DEFAULT 'Building The',
    hero_highlight TEXT NOT NULL DEFAULT 'Backbone',
    hero_subtitle TEXT NOT NULL DEFAULT 'of Modern Industry',
    hero_description TEXT NOT NULL DEFAULT 'From pre-engineered buildings to heavy industrial frameworks — we design, fabricate, and erect world-class steel structures with uncompromising quality across Bangladesh.',
    projects_count TEXT NOT NULL DEFAULT '500+',
    projects_label TEXT NOT NULL DEFAULT 'Projects',
    years_count TEXT NOT NULL DEFAULT '15+',
    years_label TEXT NOT NULL DEFAULT 'Years',
    clients_count TEXT NOT NULL DEFAULT '200+',
    clients_label TEXT NOT NULL DEFAULT 'Clients',
    certification_count TEXT NOT NULL DEFAULT 'ISO',
    certification_label TEXT NOT NULL DEFAULT 'Certified',
    what_we_do JSONB DEFAULT '[
        {"icon": "Factory", "title": "Pre-Engineered Buildings", "description": "Custom-designed PEB structures for any industrial use case."},
        {"icon": "Building2", "title": "Steel Structure Fabrication", "description": "Heavy-duty trusses, frames, and skeletons built to spec."},
        {"icon": "HardHat", "title": "Erection & Installation", "description": "Expert on-site crews delivering safe, on-time installs."},
        {"icon": "Wrench", "title": "Design & Build Package", "description": "End-to-end services from blueprint to handover."},
        {"icon": "Shield", "title": "Quality Standards", "description": "Building quality standards that meet international norms."},
        {"icon": "Cog", "title": "Roofing & Cladding", "description": "Premium sheets, purlins, and accessories for any roof."}
    ]'::jsonb,
    about_header_eyebrow TEXT NOT NULL DEFAULT 'About Us',
    about_header_title TEXT NOT NULL DEFAULT 'Get to Know Us',
    about_header_description TEXT NOT NULL DEFAULT 'A leading provider of industrial steel structures with unrivaled expertise, comprehensive services, and a commitment to innovation.',
    about_story_title TEXT NOT NULL DEFAULT 'Committed to only',
    about_story_highlight TEXT NOT NULL DEFAULT 'High Quality Service',
    about_story_p1 TEXT NOT NULL DEFAULT 'City Steel Corporation stands out as a leading provider of steel structures, with its unrivaled expertise, comprehensive services, commitment to innovation, and dedication to client satisfaction.',
    about_story_p2 TEXT NOT NULL DEFAULT 'With a track record of successful projects across various industries, City Steel Corporation continues to deliver exceptional results by combining quality craftsmanship, innovative solutions, and a customer-centric approach.',
    about_features JSONB DEFAULT '[
        {"icon": "Target", "title": "Mission", "description": "Deliver world-class steel structures with uncompromising quality."},
        {"icon": "Eye", "title": "Vision", "description": "To be the most trusted name in industrial steel construction."},
        {"icon": "Award", "title": "Quality", "description": "Building quality standards that exceed expectations."},
        {"icon": "Users", "title": "Clients", "description": "200+ satisfied clients across diverse industries."}
    ]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If the table already exists, just add the new column (safe to run multiple times if you ignore the error or wrap in DO block)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='what_we_do') THEN
        ALTER TABLE public.site_settings ADD COLUMN what_we_do JSONB DEFAULT '[
            {"icon": "Factory", "title": "Pre-Engineered Buildings", "description": "Custom-designed PEB structures for any industrial use case."},
            {"icon": "Building2", "title": "Steel Structure Fabrication", "description": "Heavy-duty trusses, frames, and skeletons built to spec."},
            {"icon": "HardHat", "title": "Erection & Installation", "description": "Expert on-site crews delivering safe, on-time installs."},
            {"icon": "Wrench", "title": "Design & Build Package", "description": "End-to-end services from blueprint to handover."},
            {"icon": "Shield", "title": "Quality Standards", "description": "Building quality standards that meet international norms."},
            {"icon": "Cog", "title": "Roofing & Cladding", "description": "Premium sheets, purlins, and accessories for any roof."}
        ]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='hero_top_text') THEN
        ALTER TABLE public.site_settings ADD COLUMN hero_top_text TEXT NOT NULL DEFAULT 'City Steel Corporation · Est. 2009';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='about_header_eyebrow') THEN
        ALTER TABLE public.site_settings 
        ADD COLUMN about_header_eyebrow TEXT NOT NULL DEFAULT 'About Us',
        ADD COLUMN about_header_title TEXT NOT NULL DEFAULT 'Get to Know Us',
        ADD COLUMN about_header_description TEXT NOT NULL DEFAULT 'A leading provider of industrial steel structures with unrivaled expertise, comprehensive services, and a commitment to innovation.',
        ADD COLUMN about_story_title TEXT NOT NULL DEFAULT 'Committed to only',
        ADD COLUMN about_story_highlight TEXT NOT NULL DEFAULT 'High Quality Service',
        ADD COLUMN about_story_p1 TEXT NOT NULL DEFAULT 'City Steel Corporation stands out as a leading provider of steel structures, with its unrivaled expertise, comprehensive services, commitment to innovation, and dedication to client satisfaction.',
        ADD COLUMN about_story_p2 TEXT NOT NULL DEFAULT 'With a track record of successful projects across various industries, City Steel Corporation continues to deliver exceptional results by combining quality craftsmanship, innovative solutions, and a customer-centric approach.',
        ADD COLUMN about_features JSONB DEFAULT '[
            {"icon": "Target", "title": "Mission", "description": "Deliver world-class steel structures with uncompromising quality."},
            {"icon": "Eye", "title": "Vision", "description": "To be the most trusted name in industrial steel construction."},
            {"icon": "Award", "title": "Quality", "description": "Building quality standards that exceed expectations."},
            {"icon": "Users", "title": "Clients", "description": "200+ satisfied clients across diverse industries."}
        ]'::jsonb;
    END IF;
END $$;

-- Allow public read access
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public read access on site_settings" ON public.site_settings;
    CREATE POLICY "Allow public read access on site_settings"
        ON public.site_settings
        FOR SELECT
        USING (true);
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow authenticated full access on site_settings" ON public.site_settings;
    CREATE POLICY "Allow authenticated full access on site_settings"
        ON public.site_settings
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
END $$;

-- Insert initial row if not exists
INSERT INTO public.site_settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);
