/**
 * Security Utilities
 * Implements input/output sanitization, XSS mitigation, and prompt injection defense.
 */

/**
 * Strips HTML tags to prevent cross-site scripting (XSS) rendering issues.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  // Strip standard HTML tags
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes user input messages by stripping HTML tags and redacting prompt injection patterns.
 */
export function sanitizeUserMessage(message: string): string {
  if (!message) return '';

  // 1. Strip HTML tags
  let sanitized = sanitizeText(message);

  // 2. List of injection patterns to scan and redact
  const injectionPatterns = [
    /ignore\s+previous\s+instructions/i,
    /reveal\s+system\s+prompt/i,
    /show\s+api\s+keys/i,
    /act\s+as\s+(a\s+)?developer/i,
    /reveal\s+hidden\s+configuration/i,
    /output\s+environment\s+variables/i,
    /system\s+prompt\s+leak/i
  ];

  // Redact matches
  injectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED PROMPT INJECTION ATTEMPT]');
  });

  return sanitized;
}
