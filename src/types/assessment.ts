/**
 * Carbon footprint assessment type definitions.
 * @module types/assessment
 */

import type { ID, Timestamp } from './common';

/** Categories of carbon emissions */
export type CarbonCategory = 
  | 'transportation'
  | 'energy'
  | 'food'
  | 'shopping'
  | 'housing'
  | 'waste';

/** Question input types */
export type QuestionInputType = 
  | 'single-choice'
  | 'multiple-choice'
  | 'slider'
  | 'number'
  | 'text';

/** A single assessment question */
export interface AssessmentQuestion {
  readonly id: ID;
  readonly category: CarbonCategory;
  readonly text: string;
  readonly description?: string;
  readonly inputType: QuestionInputType;
  readonly options?: readonly AssessmentOption[];
  readonly validation?: QuestionValidation;
  readonly order: number;
}

/** Option for choice-based questions */
export interface AssessmentOption {
  readonly id: ID;
  readonly label: string;
  readonly value: string | number;
  readonly carbonImpact: number;
}

/** Validation rules for questions */
export interface QuestionValidation {
  readonly required: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: string;
}

/** Complete assessment entity */
export interface Assessment {
  readonly id: ID;
  readonly userId: ID;
  readonly completedAt: Timestamp;
  readonly answers: readonly AssessmentAnswer[];
  readonly result: AssessmentResult;
}

/** A single answer to an assessment question */
export interface AssessmentAnswer {
  readonly questionId: ID;
  readonly value: string | number | readonly string[];
}

/** Assessment result with carbon breakdown */
export interface AssessmentResult {
  readonly totalCarbonKg: number;
  readonly breakdown: readonly CategoryBreakdown[];
  readonly percentile: number;
  readonly comparedToAverage: number;
  readonly recommendations: readonly string[];
}

/** Carbon breakdown by category */
export interface CategoryBreakdown {
  readonly category: CarbonCategory;
  readonly carbonKg: number;
  readonly percentage: number;
}
