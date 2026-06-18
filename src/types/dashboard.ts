/**
 * Dashboard type definitions.
 * @module types/dashboard
 */

import type { CarbonCategory } from './assessment';
import type { Timestamp } from './common';

/** Time range filter for dashboard data */
export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

/** Dashboard metric card data */
export interface DashboardMetrics {
  readonly totalCarbonSaved: number;
  readonly currentFootprint: number;
  readonly streakDays: number;
  readonly completedActions: number;
  readonly rank?: number;
}

/** Emission data broken down for visualization */
export interface EmissionBreakdown {
  readonly category: CarbonCategory;
  readonly current: number;
  readonly previous: number;
  readonly target: number;
  readonly trend: 'up' | 'down' | 'stable';
}

/** Time-series data point for charts */
export interface TimeSeriesDataPoint {
  readonly timestamp: Timestamp;
  readonly value: number;
  readonly label?: string;
}

/** Impact summary for user's sustainability journey */
export interface ImpactSummary {
  readonly treesEquivalent: number;
  readonly milesSaved: number;
  readonly waterLitersSaved: number;
  readonly energyKwhSaved: number;
}

/** Dashboard widget configuration */
export interface DashboardWidget {
  readonly id: string;
  readonly type: 'metric' | 'chart' | 'breakdown' | 'impact';
  readonly title: string;
  readonly position: { row: number; col: number };
  readonly size: { width: number; height: number };
  readonly visible: boolean;
}
