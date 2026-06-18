import type { Metadata } from 'next';
import { DashboardOverview } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard — EcoVerse AI',
  description: 'Your sustainability mission control: carbon score, trends, and AI guidance.',
};

export default function DashboardOverviewPage() {
  return <DashboardOverview />;
}
