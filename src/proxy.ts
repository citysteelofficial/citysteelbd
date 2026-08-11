import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { normalizePath } from '@/lib/paths';

/**
 * Serves the redirect rules the client manages at /admin/redirects.
 *
 * Runs ahead of routing on every page request, so the rule set is cached in
 * module scope and refreshed at most once a minute per server instance. Any
 * failure here must fail open — a Supabase hiccup should never take the site
 * down, it should just mean no redirect on that request.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CACHE_TTL_MS = 60_000;

type Rule = { to_path: string; status_code: number };

let cachedRules: Map<string, Rule> | null = null;
let cacheExpiresAt = 0;
let inFlight: Promise<Map<string, Rule>> | null = null;

async function fetchRules(): Promise<Map<string, Rule>> {
  const endpoint =
    `${SUPABASE_URL}/rest/v1/redirects` +
    `?select=from_path,to_path,status_code&is_active=eq.true`;

  const response = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Redirect fetch failed: ${response.status}`);

  const rows: Array<{ from_path: string; to_path: string; status_code: number }> =
    await response.json();

  const map = new Map<string, Rule>();
  for (const row of rows) {
    map.set(normalizePath(row.from_path), {
      to_path: row.to_path,
      status_code: row.status_code === 302 ? 302 : 301,
    });
  }
  return map;
}

async function getRules(): Promise<Map<string, Rule>> {
  const now = Date.now();
  if (cachedRules && now < cacheExpiresAt) return cachedRules;

  // Collapse concurrent refreshes so a cold instance makes one request, not one
  // per in-flight visitor.
  if (!inFlight) {
    inFlight = fetchRules()
      .then((map) => {
        cachedRules = map;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return map;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  try {
    return await inFlight;
  } catch {
    // Serve the previous rule set if we have one; otherwise no redirects.
    return cachedRules ?? new Map();
  }
}

function recordHit(fromPath: string): Promise<unknown> {
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/bump_redirect_hit`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_from_path: fromPath }),
    cache: 'no-store',
  }).catch(() => undefined);
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;

  // Let every request through untouched if the backend is not configured.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return NextResponse.next();

  const normalized = normalizePath(pathname);

  try {
    const rules = await getRules();
    const rule = rules.get(normalized);

    if (rule) {
      const destination = new URL(
        // Carry the query string over to the new URL, unless the rule already
        // specifies one of its own.
        rule.to_path.includes('?') ? rule.to_path : `${rule.to_path}${search}`,
        request.url,
      );

      // Never redirect a path to itself; that is an infinite loop for the visitor.
      if (normalizePath(destination.pathname) !== normalized || destination.host !== request.nextUrl.host) {
        event.waitUntil(recordHit(normalized));
        return NextResponse.redirect(destination, rule.status_code);
      }
    }
  } catch {
    // Fail open: fall through to normal routing.
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the admin panel, and static assets. Legacy extensions
  // like .html and .php are deliberately still matched — those are exactly the
  // dead URLs that tend to need redirecting.
  matcher: [
    '/((?!_next/static|_next/image|admin|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|eot|css|js|map|txt|xml|json|pdf)$).*)',
  ],
};
