import { PUBLIC_BASE_URL } from '@/config/app';

/**
 * Gets the public base URL for the application
 * Returns PUBLIC_BASE_URL if configured, otherwise falls back to window.location.origin
 */
export function getPublicBaseUrl(): string {
  if (PUBLIC_BASE_URL && PUBLIC_BASE_URL.trim() !== '') {
    // Remove trailing slash if present
    return PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  return window.location.origin;
}

/**
 * Builds an absolute URL for sharing using the configured public base URL
 * @param path - The path to append to the base URL (should start with /)
 */
export function buildAbsoluteShareUrl(path: string): string {
  const base = getPublicBaseUrl();
  return `${base}${path}`;
}

/**
 * Checks if the current environment is a Lovable preview domain
 */
export function isLovablePreviewDomain(): boolean {
  return window.location.hostname.endsWith('lovableproject.com');
}
