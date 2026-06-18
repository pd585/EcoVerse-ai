/**
 * Future impact simulator type definitions.
 * @module types/simulator
 */

import type { ID, Timestamp } from './common';

/** Variables that can be adjusted in simulations */
export type EnvironmentalVariable =
  | 'transportation_mode'
  | 'energy_source'
  | 'diet_type'
  | 'consumption_level'
  | 'waste_management'
  | 'housing_efficiency';

/** Simulation time horizon */
export type SimulationHorizon = '1y' | '5y' | '10y' | '25y' | '50y';

/** A simulation scenario configuration */
export interface SimulationScenario {
  readonly id: ID;
  readonly name: string;
  readonly description: string;
  readonly variables: Record<EnvironmentalVariable, number>;
  readonly horizon: SimulationHorizon;
  readonly isPreset: boolean;
}

/** Result of running a simulation */
export interface SimulationResult {
  readonly scenarioId: ID;
  readonly projectedCarbonKg: number;
  readonly comparedToBaseline: number;
  readonly timelineData: readonly SimulationDataPoint[];
  readonly insights: readonly SimulationInsight[];
  readonly generatedAt: Timestamp;
}

/** Data point in simulation timeline */
export interface SimulationDataPoint {
  readonly year: number;
  readonly carbonKg: number;
  readonly baselineCarbonKg: number;
  readonly cumulativeSavings: number;
}

/** AI-generated insight from simulation */
export interface SimulationInsight {
  readonly type: 'positive' | 'warning' | 'suggestion';
  readonly title: string;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high';
}

/** Complete simulation entity */
export interface Simulation {
  readonly id: ID;
  readonly userId: ID;
  readonly scenario: SimulationScenario;
  readonly result: SimulationResult;
  readonly createdAt: Timestamp;
  readonly isSaved: boolean;
}
