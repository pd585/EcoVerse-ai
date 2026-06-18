/**
 * Barrel export for all Zustand stores.
 * @module store
 */

export { useAppStore } from './useAppStore';
export type { AppState, AppActions, Notification } from './useAppStore';

export { useAssessmentStore } from './useAssessmentStore';
export type { AssessmentState, AssessmentActions } from './useAssessmentStore';

export { useSimulatorStore } from './useSimulatorStore';
export type { SimulatorState, SimulatorActions } from './useSimulatorStore';

export { useDashboardStore } from './useDashboardStore';
export type { DashboardState, DashboardActions } from './useDashboardStore';
