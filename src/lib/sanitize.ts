import sanitizeHtmlLib from 'sanitize-html';

/** Non-breaking space, written as an escape so it is visible in the source. */
const NBSP = '\u00a0';

/**
 * Sanitize HTML content from the CMS to prevent XSS attacks.
 * Strips dangerous tags like <script>, event handlers, etc.
 * Uses sanitize-html which is purely JS-based and safe for Next.js Server Components.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'figure', 'figcaption',
      'sub', 'sup', 'mark',
      'iframe'
    ],
    allowedAttributes: {
      '*': ['class', 'id', 'style'],
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      'th': ['colspan', 'rowspan'],
      'td': ['colspan', 'rowspan'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
    },
    // Editors paste from Word and Google Docs, which drags hard-coded colours
    // and white backgrounds into the CMS. Those override the site theme and
    // look broken, so only alignment survives — the rest inherits the design.
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
      },
    },
    // Every page template already renders its title as the h1, so an h1 in the
    // body would compete with it. Demote it to keep one h1 per page.
    transformTags: {
      h1: 'h2',
    },
    // Pasted content is riddled with non-breaking spaces, which stop text from
    // wrapping normally and cause ragged mid-word line breaks.
    textFilter: (text) =>
      text.replace(/&nbsp;/g, ' ').split(NBSP).join(' '),
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
  });
}
