export interface Project {
  id: string;
  title: string;
  slug: string;
  status: 'ONGOING' | 'COMPLETED';
  location?: string | null;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url?: string | null;
  is_published: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  created_at: string;
}
