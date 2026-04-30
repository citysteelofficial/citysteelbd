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

  const latestBlogs = data || [];

  return <HomeClient latestBlogs={latestBlogs} />;
}
