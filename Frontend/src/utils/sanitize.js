const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:'];

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';

  try {
    const parsed = new URL(trimmed);
    if (ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return parsed.href;
    }
    return '#';
  } catch {
    // Relative URLs or invalid — block anything that looks like a protocol attack
    if (/^[a-z]+:/i.test(trimmed) && !trimmed.startsWith('/')) {
      return '#';
    }
    return trimmed;
  }
}

export function sanitizeImageSrc(src) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();

  // Allow data:image/* URIs (base64 uploads)
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/i.test(trimmed)) {
    return trimmed;
  }

  // Allow http/https image URLs
  try {
    const parsed = new URL(trimmed);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().slice(0, 5000);
}

export function isValidHttpUrl(str) {
  if (!str || typeof str !== 'string') return false;
  try {
    const parsed = new URL(str.trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
