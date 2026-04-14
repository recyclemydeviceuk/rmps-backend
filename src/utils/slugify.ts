/**
 * Generate a URL-safe slug from any string.
 * e.g. "iPhone 15 Pro Max" -> "iphone-15-pro-max"
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces to hyphens
    .replace(/[^\w-]+/g, '')     // remove non-word chars
    .replace(/--+/g, '-')        // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');    // trim leading/trailing hyphens
}
