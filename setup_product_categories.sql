-- SQL script to create product_categories table and insert initial data

CREATE TABLE IF NOT EXISTS public.product_categories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Policies (Safe to run multiple times, will ignore if exists or delete and recreate)
DROP POLICY IF EXISTS "Public read product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins full product_categories" ON public.product_categories;

CREATE POLICY "Public read product_categories" ON public.product_categories FOR SELECT USING ( true );
CREATE POLICY "Admins full product_categories" ON public.product_categories FOR ALL USING ( auth.role() = 'authenticated' );

-- Insert initial values safely (using ON CONFLICT DO NOTHING)
INSERT INTO public.product_categories (title, slug) VALUES
('STEEL COLUMN', 'steel-column'),
('STEEL BEAM', 'steel-beam'),
('PURLIN', 'purlin'),
('SLIDING DOOR', 'sliding-door'),
('ROOF MONITOR', 'roof-monitor'),
('MS PLATE', 'ms-plate'),
('INDUSTRIAL DECK SHEET', 'industrial-deck-sheet'),
('INDUSTRIAL ROOF SHEET', 'industrial-roof-sheet'),
('Self-Drilling Screw', 'self-drilling-screw'),
('RAFTER', 'rafter')
ON CONFLICT (slug) DO NOTHING;
