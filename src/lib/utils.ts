/**
 * Utility function to merge class names.
 * Simplified version since tailwind-merge was removed with unused UI components.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
