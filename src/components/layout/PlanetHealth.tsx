'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getDailyPlanetHealth } from '@/data/daily-data';

export interface PlanetHealthProps {
  trend?: string;
  change?: string;
  className?: string;
}

export function PlanetHealth({
  trend = 'Improving',
  change,
  className,
}: PlanetHealthProps) {
  const [displayChange, setDisplayChange] = useState<string>('+18% this year');

  useEffect(() => {
    if (change) {
      setDisplayChange(change);
    } else {
      setDisplayChange(getDailyPlanetHealth());
    }
  }, [change]);

  return (
    <div
      className={cn('glass-soft rounded-2xl px-3.5 py-2.5', className)}
      aria-label="Planet health"
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <span aria-hidden>🌍</span>
        Planet Health
      </p>
      <p className="mt-3 text-sm font-semibold text-accent-emerald">
        ↗ {trend}
      </p>
      <p className="mt-1 text-xs leading-snug text-foreground/70">{displayChange}</p>
    </div>
  );
}
