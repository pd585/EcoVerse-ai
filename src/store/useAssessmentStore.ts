/**
 * Assessment feature state store.
 * Manages carbon footprint assessment flow state.
 * @module store/useAssessmentStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AssessmentAnswer, AssessmentResult } from '@/types';

export interface AssessmentState {
  /** Current step index in the assessment flow */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Collected answers */
  answers: readonly AssessmentAnswer[];
  /** Computed assessment result, if available */
  result: AssessmentResult | null;
  /** Whether the assessment is in progress */
  isInProgress: boolean;
}

export interface AssessmentActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  addAnswer: (answer: AssessmentAnswer) => void;
  setResult: (result: AssessmentResult) => void;
  resetAssessment: () => void;
  startAssessment: (totalSteps: number) => void;
}

const initialState: AssessmentState = {
  currentStep: 0,
  totalSteps: 0,
  answers: [],
  result: null,
  isInProgress: false,
};

export const useAssessmentStore = create<AssessmentState & AssessmentActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }, false, 'setCurrentStep'),

      nextStep: () =>
        set(
          (state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
          }),
          false,
          'nextStep'
        ),

      previousStep: () =>
        set(
          (state) => ({
            currentStep: Math.max(state.currentStep - 1, 0),
          }),
          false,
          'previousStep'
        ),

      addAnswer: (answer) =>
        set(
          (state) => {
            const filtered = state.answers.filter(
              (a) => a.questionId !== answer.questionId
            );
            return { answers: [...filtered, answer] };
          },
          false,
          'addAnswer'
        ),

      setResult: (result) =>
        set({ result, isInProgress: false }, false, 'setResult'),

      resetAssessment: () => set(initialState, false, 'resetAssessment'),

      startAssessment: (totalSteps) =>
        set(
          { ...initialState, totalSteps, isInProgress: true },
          false,
          'startAssessment'
        ),
    }),
    { name: 'EcoVerse/Assessment' }
  )
);
