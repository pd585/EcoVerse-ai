/**
 * Profile and Settings type definitions.
 * @module features/profile/types
 */

export interface ProfilePreferences {
  theme: 'dark' | 'light' | 'system';
  notifications: boolean;
  language: string;
}
