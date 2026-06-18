import type { Metadata } from 'next';
import { MissionTimeline } from '@/features/roadmap';

export const metadata: Metadata = {
  title: 'Roadmap — EcoVerse AI',
  description: 'Your personalized sustainability mission — today, this week, this month, and beyond.',
};

export default function RoadmapPage() {
  return <MissionTimeline />;
}
