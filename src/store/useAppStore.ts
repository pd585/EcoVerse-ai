/**
 * Global application state store.
 * Manages UI-level state: theme, sidebar, modals, notifications.
 * @module store/useAppStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  readonly id: string;
  readonly type: 'success' | 'error' | 'warning' | 'info';
  readonly title: string;
  readonly message?: string;
  readonly duration?: number;
}

export interface AppState {
  /** Current theme mode */
  theme: 'light' | 'dark' | 'system';
  /** Whether the sidebar is expanded */
  sidebarOpen: boolean;
  /** Currently active modal ID, or null */
  activeModal: string | null;
  /** Active notification queue */
  notifications: readonly Notification[];
  /** Whether the app is in a global loading state */
  isLoading: boolean;
}

export interface AppActions {
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState: AppState = {
  theme: 'system',
  sidebarOpen: true,
  activeModal: null,
  notifications: [],
  isLoading: false,
};

/**
 * Global application store.
 * Handles cross-cutting UI state that isn't feature-specific.
 */
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }, false, 'setTheme'),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),

      openModal: (modalId) => set({ activeModal: modalId }, false, 'openModal'),

      closeModal: () => set({ activeModal: null }, false, 'closeModal'),

      addNotification: (notification) =>
        set(
          (state) => ({ notifications: [...state.notifications, notification] }),
          false,
          'addNotification'
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'removeNotification'
        ),

      clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
    }),
    { name: 'EcoVerse/App' }
  )
);
