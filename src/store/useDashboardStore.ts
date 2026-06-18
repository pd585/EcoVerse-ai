/**
 * Dashboard feature state store.
 * Manages dashboard filters, time range, and cached metrics.
 * @module store/useDashboardStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  DashboardMetrics,
  TimeRange,
  DashboardWidget,
} from '@/types';

export interface DashboardState {
  /** Selected time range filter */
  timeRange: TimeRange;
  /** Cached dashboard metrics */
  metrics: DashboardMetrics | null;
  /** Dashboard widget layout configuration */
  widgets: readonly DashboardWidget[];
  /** Whether dashboard data is being fetched */
  isRefreshing: boolean;
  /** Last time data was refreshed */
  lastRefreshedAt: string | null;
}

export interface DashboardActions {
  setTimeRange: (range: TimeRange) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setWidgets: (widgets: readonly DashboardWidget[]) => void;
  toggleWidget: (widgetId: string) => void;
  setRefreshing: (refreshing: boolean) => void;
  markRefreshed: () => void;
  resetDashboard: () => void;
}

const initialState: DashboardState = {
  timeRange: 'month',
  metrics: null,
  widgets: [],
  isRefreshing: false,
  lastRefreshedAt: null,
};

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setTimeRange: (range) =>
        set({ timeRange: range }, false, 'setTimeRange'),

      setMetrics: (metrics) =>
        set({ metrics }, false, 'setMetrics'),

      setWidgets: (widgets) =>
        set({ widgets }, false, 'setWidgets'),

      toggleWidget: (widgetId) =>
        set(
          (state) => ({
            widgets: state.widgets.map((w) =>
              w.id === widgetId ? { ...w, visible: !w.visible } : w
            ),
          }),
          false,
          'toggleWidget'
        ),

      setRefreshing: (refreshing) =>
        set({ isRefreshing: refreshing }, false, 'setRefreshing'),

      markRefreshed: () =>
        set(
          { isRefreshing: false, lastRefreshedAt: new Date().toISOString() },
          false,
          'markRefreshed'
        ),

      resetDashboard: () => set(initialState, false, 'resetDashboard'),
    }),
    { name: 'EcoVerse/Dashboard' }
  )
);
