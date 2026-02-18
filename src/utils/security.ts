/**
 * Security Utilities
 * 
 * Input sanitization, validation, and safe error handling
 */

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .slice(0, 100)
    .trim();
}

export function sanitizeString(value: unknown, maxLength = 1000): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLength).trim();
}

export function isValidCoinId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id) && id.length <= 50;
}

export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('429')) {
      return 'Rate limit reached. Please wait a moment.';
    }
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
