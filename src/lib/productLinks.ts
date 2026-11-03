type Category = { title: string; slug: string };
type ProductRef = { slug: string; category: string | null };

/**
 * Resolve where each product category should link to.
 *
 * Most categories hold a single product, and those category pages
 * canonicalise to the product page (see src/app/products/[slug]/page.tsx).
 * Internal links should point at the canonical URL directly, so:
 *
 * - one product   → /product/{product-slug}
 * - two or more   → /products/{category-slug}
 * - no products   → dropped (the category page is noindexed and empty)
 *
 * If the product list could not be loaded, fall back to plain category links
 * rather than hiding the whole menu.
 */
export function withCategoryHrefs<T extends Category>(
  categories: T[],
  products: ProductRef[] | null | undefined,
): (T & { href: string })[] {
  if (!products || products.length === 0) {
    return categories.map((c) => ({ ...c, href: `/products/${c.slug}` }));
  }

  const byCategory = new Map<string, string[]>();
  for (const p of products) {
    if (!p.category) continue;
    const list = byCategory.get(p.category) ?? [];
    list.push(p.slug);
    byCategory.set(p.category, list);
  }

  return categories.flatMap((c) => {
    const items = byCategory.get(c.slug) ?? [];
    if (items.length === 0) return [];
    const href = items.length === 1 ? `/product/${items[0]}` : `/products/${c.slug}`;
    return [{ ...c, href }];
  });
}
