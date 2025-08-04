/**
 * Capitalizes the first letter of a string while keeping the rest unchanged
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 * @example capitalize('hello world') // 'Hello world'
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to a URL-friendly slug format
 * @param str - The string to convert to a slug
 * @returns A URL-safe slug with hyphens replacing spaces and special characters removed
 * @example slugify('Hello World!') // 'hello-world'
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
