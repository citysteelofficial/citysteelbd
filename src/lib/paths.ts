/**
 * Canonical form for a stored or incoming URL path.
 *
 * Redirect rules are matched on this form so that "/Old-Page/", "/old-page"
 * and "/OLD-PAGE" all resolve to the same rule. Both the proxy and the admin
 * panel must normalise through here or lookups will silently miss.
 */
export function normalizePath(input: string | null | undefined): string {
  if (!input) return '';

  let path = input.trim();
  if (!path) return '';

  // Accept a full URL pasted out of Search Console and keep only its path.
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return '';
    }
  }

  // Drop any query string or fragment — rules match on the path alone.
  path = path.split('?')[0].split('#')[0];

  if (!path.startsWith('/')) path = `/${path}`;

  path = path.toLowerCase();

  // Collapse duplicate slashes, then strip the trailing one ("/" stays "/").
  path = path.replace(/\/{2,}/g, '/');
  if (path.length > 1) path = path.replace(/\/+$/, '');

  return path;
}

/**
 * A redirect target may be a site-relative path or a full external URL.
 * Anything else (javascript:, protocol-relative //evil.com, …) is rejected so
 * an admin typo cannot turn into an open redirect.
 */
export function isValidTarget(target: string | null | undefined): boolean {
  if (!target) return false;
  const value = target.trim();
  if (!value) return false;

  if (/^https?:\/\//i.test(value)) return true;
  return value.startsWith('/') && !value.startsWith('//');
}
