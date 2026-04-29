-- SQL Script for Supabase Dashboard

-- 1. Create Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ONGOING', 'COMPLETED')),
  location TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  content TEXT, -- Rich text content for the product
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Services Table
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  content TEXT, -- Rich text content for the service
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Blogs Table
CREATE TABLE blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read projects" ON projects FOR SELECT USING ( true );
CREATE POLICY "Public read products" ON products FOR SELECT USING ( true );
CREATE POLICY "Public read services" ON services FOR SELECT USING ( true );
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING ( is_published = true );
CREATE POLICY "Admin read all blogs" ON blogs FOR SELECT USING ( auth.role() = 'authenticated' );

-- Anyone can submit a contact message
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK ( true );
-- Only admins can read/delete contact messages
CREATE POLICY "Admin read contact" ON contact_messages FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admin delete contact" ON contact_messages FOR DELETE USING ( auth.role() = 'authenticated' );

-- Allow authenticated users (Admins) to insert/update/delete
CREATE POLICY "Admins full projects" ON projects FOR ALL USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins full products" ON products FOR ALL USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins full services" ON services FOR ALL USING ( auth.role() = 'authenticated' );
CREATE POLICY "Admins full blogs" ON blogs FOR ALL USING ( auth.role() = 'authenticated' );
