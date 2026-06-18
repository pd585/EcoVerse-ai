import type { Metadata } from 'next';
import { LearnGrid } from '@/features/learn';

export const metadata: Metadata = {
  title: 'Learn Hub — EcoVerse AI',
  description: 'Interactive, visual learning pathways on climate, energy, and sustainable living.',
};

export default function LearnPage() {
  return <LearnGrid />;
}
