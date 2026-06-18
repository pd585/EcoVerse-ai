import type { Metadata } from 'next';
import CoachClient from './CoachClient';

export const metadata: Metadata = {
  title: 'AI Coach — EcoVerse AI',
  description: 'Your personal sustainability mentor — friendly, intelligent guidance whenever you need it.',
};

export default function CoachPage() {
  return <CoachClient />;
}
