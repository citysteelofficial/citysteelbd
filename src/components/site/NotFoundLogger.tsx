"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { normalizePath } from '@/lib/paths';

/**
 * Records the dead URL so it shows up under /admin/redirects.
 *
 * This deliberately runs in the browser. The obvious alternative — reading the
 * path from headers() inside not-found.tsx — is a dynamic API in a file that
 * belongs to every route's tree, which drops the whole site out of static
 * generation. Logging is not worth making every page server-render.
 *
 * The trade-off is that only JS-capable clients are counted. Real visitors and
 * Googlebot both qualify; simpler crawlers do not.
 */
export function NotFoundLogger() {
  useEffect(() => {
    const path = normalizePath(window.location.pathname);
    if (!path || path === '/') return;

    supabase
      .rpc('log_not_found', {
        p_path: path,
        p_referrer: document.referrer || null,
      })
      // A logging failure must never surface to the visitor.
      .then(undefined, () => undefined);
  }, []);

  return null;
}
