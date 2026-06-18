/**
 * User-related type definitions.
 * @module types/user
 */

import type { ID, Timestamp } from './common';

/** User roles within the platform */
export type UserRole = 'user' | 'premium' | 'admin';

/** User authentication status */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/** Core user entity */
export interface User {
  readonly id: ID;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly role: UserRole;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

/** Extended user profile */
export interface UserProfile extends User {
  readonly bio?: string;
  readonly location?: string;
  readonly sustainabilityScore?: number;
  readonly completedAssessments: number;
  readonly joinedChallenges: number;
}

/** User preference settings */
export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'system';
  readonly reducedMotion: boolean;
  readonly language: string;
  readonly notifications: NotificationPreferences;
  readonly accessibility: AccessibilityPreferences;
}

/** Notification preference settings */
export interface NotificationPreferences {
  readonly email: boolean;
  readonly push: boolean;
  readonly weeklyDigest: boolean;
  readonly coachReminders: boolean;
}

/** Accessibility preference settings */
export interface AccessibilityPreferences {
  readonly highContrast: boolean;
  readonly fontSize: 'small' | 'medium' | 'large';
  readonly screenReader: boolean;
}
