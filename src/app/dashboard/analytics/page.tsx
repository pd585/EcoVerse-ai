import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Analytics — EcoVerse AI',
  description: 'Detailed carbon graphs and breakdown analytics.',
};

export default function DashboardAnalyticsPage() {
  // Future: full analytics with recharts breakdown charts
  return (
    <AppShell title="Analytics" subtitle="Detailed carbon graphs and breakdown — coming soon.">
      <div className="glass flex min-h-[40vh] items-center justify-center rounded-3xl">
        <div className="text-center">
          <div className="text-4xl">📊</div>
          <p className="mt-4 text-muted-foreground">
            Detailed analytics coming in the next phase.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
