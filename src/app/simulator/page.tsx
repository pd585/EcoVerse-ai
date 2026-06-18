import type { Metadata } from 'next';
import { SimulatorPage } from '@/features/simulator';

export const metadata: Metadata = {
  title: 'Simulator — EcoVerse AI',
  description: 'A futuristic sustainability lab: explore what happens if you change your habits.',
};

export default function SimulatorRootPage() {
  return <SimulatorPage />;
}
