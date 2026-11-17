/**
 * Resolves item image paths to browser-renderable URLs.
 * Handles data URIs, absolute URLs, relative URLs, and bare filenames from uploads.
 */
export const getImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Bare filenames like item_698bfe8e93bbf.png
  return `/uploads/${trimmed}`;
};

export default getImageUrl;
