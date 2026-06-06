/**
 * Strips any leading path prefix from a slug.
 * Handles cases where the database slug was accidentally stored with a path prefix
 * (e.g. "/blogs/my-post" instead of "my-post").
 *
 * Examples:
 *   cleanSlug("/blogs/my-post")   → "my-post"
 *   cleanSlug("my-post")          → "my-post"
 *   cleanSlug("/blogs//blogs/x")  → "x"
 */
export function cleanSlug(slug: string | null | undefined): string {
  if (!slug) return '';
  // Remove any leading slashes and path segments, keep only the last segment
  const parts = slug.split('/').filter(Boolean);
  return parts[parts.length - 1] || slug;
}
