/**
 * Feature highlight section listing EcoVerse AI's three core pillars.
 * Rendered as an accessible semantic list during the final intro scene.
 * Static scaffolding — no animation or data fetching.
 * @module features/intro/components/FeatureHighlight
 */

import type { ReactElement } from 'react';

/** Internal type describing a single feature pillar entry. */
interface FeaturePillar {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

/** The three core pillars of the EcoVerse AI platform. */
const FEATURE_PILLARS: readonly FeaturePillar[] = [
  {
    id: 'understand',
    label: 'Understand',
    description: 'Measure your real carbon footprint with AI-guided precision.',
  },
  {
    id: 'simulate',
    label: 'Simulate',
    description: 'Model the climate impact of your choices across decades.',
  },
  {
    id: 'act',
    label: 'Act',
    description: 'Receive a personalised roadmap to meaningful, lasting change.',
  },
] as const;

/**
 * Renders the three EcoVerse AI feature pillars as an accessible list.
 *
 * Accessibility:
 * - `<section>` with a visually-hidden heading for landmark navigation.
 * - `<ul>` with descriptive list items, each uniquely keyed.
 */
export function FeatureHighlight(): ReactElement {
  return (
    <section aria-labelledby='feature-highlight-heading'>
      <h2
        id='feature-highlight-heading'
        className='sr-only'
      >
        Platform features
      </h2>

      <ul
        role='list'
        className='flex flex-col gap-4 sm:flex-row sm:justify-center'
      >
        {FEATURE_PILLARS.map((pillar) => (
          <li
            key={pillar.id}
            className='flex-1 rounded-xl bg-white/10 p-5 text-white backdrop-blur-sm'
          >
            <h3 className='text-lg font-bold'>{pillar.label}</h3>
            <p className='mt-1 text-sm text-white/70'>{pillar.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
