/**
 * Simulator feature state store.
 * Manages simulation parameters, scenarios, and cached results.
 * @module store/useSimulatorStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  SimulationScenario,
  SimulationResult,
  SimulationHorizon,
  EnvironmentalVariable,
} from '@/types';

export interface SimulatorState {
  /** Currently active scenario */
  activeScenario: SimulationScenario | null;
  /** All saved/preset scenarios */
  scenarios: readonly SimulationScenario[];
  /** Cached simulation results by scenario ID */
  resultsCache: Record<string, SimulationResult>;
  /** Whether a simulation is currently running */
  isSimulating: boolean;
  /** Selected time horizon */
  horizon: SimulationHorizon;
}

export interface SimulatorActions {
  setActiveScenario: (scenario: SimulationScenario | null) => void;
  setScenarios: (scenarios: readonly SimulationScenario[]) => void;
  updateVariable: (variable: EnvironmentalVariable, value: number) => void;
  setHorizon: (horizon: SimulationHorizon) => void;
  cacheResult: (scenarioId: string, result: SimulationResult) => void;
  setSimulating: (simulating: boolean) => void;
  clearCache: () => void;
  resetSimulator: () => void;
}

const initialState: SimulatorState = {
  activeScenario: null,
  scenarios: [],
  resultsCache: {},
  isSimulating: false,
  horizon: '10y',
};

export const useSimulatorStore = create<SimulatorState & SimulatorActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setActiveScenario: (scenario) =>
        set({ activeScenario: scenario }, false, 'setActiveScenario'),

      setScenarios: (scenarios) =>
        set({ scenarios }, false, 'setScenarios'),

      updateVariable: (variable, value) =>
        set(
          (state) => {
            if (!state.activeScenario) return state;
            return {
              activeScenario: {
                ...state.activeScenario,
                variables: {
                  ...state.activeScenario.variables,
                  [variable]: value,
                },
              },
            };
          },
          false,
          'updateVariable'
        ),

      setHorizon: (horizon) =>
        set({ horizon }, false, 'setHorizon'),

      cacheResult: (scenarioId, result) =>
        set(
          (state) => ({
            resultsCache: { ...state.resultsCache, [scenarioId]: result },
          }),
          false,
          'cacheResult'
        ),

      setSimulating: (simulating) =>
        set({ isSimulating: simulating }, false, 'setSimulating'),

      clearCache: () => set({ resultsCache: {} }, false, 'clearCache'),

      resetSimulator: () => set(initialState, false, 'resetSimulator'),
    }),
    { name: 'EcoVerse/Simulator' }
  )
);
