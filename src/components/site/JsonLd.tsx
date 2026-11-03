/**
 * Renders a JSON-LD block. `<` is escaped so CMS text can never close the
 * script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

const SITE = 'https://citysteelbd.com';

/** BreadcrumbList from [name, path] pairs, e.g. [['Home','/'],['Products','/products']]. */
export function breadcrumbLd(items: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}

/** Plain-text version of CMS HTML for schema descriptions. */
export function plainText(html: string | null | undefined, max = 300): string {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export const ORG_REF = { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'City Steel Corporation', url: SITE };
