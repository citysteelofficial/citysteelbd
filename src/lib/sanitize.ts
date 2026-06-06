import sanitizeHtmlLib from 'sanitize-html';

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
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
  });
}
