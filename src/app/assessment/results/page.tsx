import type { Metadata } from 'next';
import { PersonalityReveal } from '@/features/assessment';

export const metadata: Metadata = {
  title: 'Your Eco Personality — EcoVerse AI',
  description: 'Meet your personalized sustainability identity.',
};

export default function AssessmentResultsPage() {
  return <PersonalityReveal />;
}
