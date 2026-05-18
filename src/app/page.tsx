import { supabase } from "@/lib/supabase";
import { HomeClient } from "@/components/site/HomeClient";

export default async function HomePage() {
  // Fetch latest blogs on the server for SEO
  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  // Fetch 3 latest dynamic projects from the database
  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const latestBlogs = data || [];
  const settings = settingsData || null;
  const latestProjects = projectsData || [];

  return (
    <HomeClient
      latestBlogs={latestBlogs}
      settings={settings}
      latestProjects={latestProjects}
    />
  );
}

