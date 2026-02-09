const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a URL-safe slug from name + city with a random 4–6 char alphanumeric suffix.
 * @param {string} name
 * @param {string} city
 * @returns {string} e.g. "sai-mumbai-7f3a"
 */
export function generateSlug(name, city) {
  const slugify = (s) =>
    String(s)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const base = [slugify(name), slugify(city)].filter(Boolean).join('-');
  const length = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }
  return base ? `${base}-${hash}` : hash;
}
